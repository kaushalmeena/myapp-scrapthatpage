import type { WebContents } from "electron";

// Minimal Puppeteer-style Page driver built on Electron's in-process CDP
// (webContents.debugger). Unlike puppeteer-in-electron this needs no
// --remote-debugging-port, so it works in signed/packaged builds where the OS
// blocks remote debugging. The techniques mirror puppeteer-core's cdp/ layer:
//  - goto: Page.navigate + lifecycle tracking per loaderId (LifecycleWatcher)
//  - waitForSelector: polling that swallows transient context-destroyed errors
//  - click: scrollIntoView + getClientRects center + Input.dispatchMouseEvent
//  - type: Input.dispatchKeyEvent for ASCII, Input.insertText for the rest

export class TimeoutError extends Error {}

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Bound every CDP evaluate so a stalled renderer can never hang an operation.
const EVALUATE_TIMEOUT_MS = 15000;
const POLL_INTERVAL_MS = 100;

interface NavigateResponse {
  loaderId?: string;
  errorText?: string;
}

interface EvaluateResponse {
  result?: { value?: unknown };
  exceptionDetails?: {
    text?: string;
    exception?: { description?: string };
  };
}

interface WaitForSelectorOptions {
  timeoutMs: number;
  visible?: boolean;
}

export default class CdpPage {
  private webContents: WebContents;

  private attachPromise?: Promise<void>;

  private mainFrameId = "";

  private currentLoaderId = "";

  // Lifecycle event names seen per loaderId (document load). Puppeteer's
  // LifecycleWatcher keeps the same structure on its Frame objects.
  private lifecycle = new Map<string, Set<string>>();

  constructor(webContents: WebContents) {
    this.webContents = webContents;
  }

  private send<T>(
    method: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    return this.webContents.debugger.sendCommand(method, params) as Promise<T>;
  }

  private handleMessage = (
    _event: unknown,
    method: string,
    params: Record<string, unknown>
  ): void => {
    if (method === "Page.lifecycleEvent") {
      const { frameId, loaderId, name } = params as {
        frameId: string;
        loaderId: string;
        name: string;
      };
      if (frameId !== this.mainFrameId) {
        return;
      }
      // "init" marks the start of a new document: reset its progress and drop
      // stale entries so the map cannot grow unboundedly.
      if (name === "init") {
        this.currentLoaderId = loaderId;
        for (const key of this.lifecycle.keys()) {
          if (key !== loaderId) {
            this.lifecycle.delete(key);
          }
        }
      }
      const events = this.lifecycle.get(loaderId) ?? new Set<string>();
      events.add(name);
      this.lifecycle.set(loaderId, events);
    } else if (method === "Page.frameStoppedLoading") {
      const { frameId } = params as { frameId: string };
      // Puppeteer synthesizes both events here so a document that stops
      // loading always satisfies goto's wait condition.
      if (frameId === this.mainFrameId && this.currentLoaderId) {
        const events =
          this.lifecycle.get(this.currentLoaderId) ?? new Set<string>();
        events.add("DOMContentLoaded");
        events.add("load");
        this.lifecycle.set(this.currentLoaderId, events);
      }
    }
  };

  // Attach the in-process debugger and enable the domains goto/evaluate need.
  // Idempotent; safe to call before every operation.
  attach(): Promise<void> {
    if (!this.attachPromise) {
      this.attachPromise = (async () => {
        this.webContents.debugger.attach("1.3");
        this.webContents.debugger.on("message", this.handleMessage);
        this.webContents.debugger.once("detach", () => {
          this.webContents.debugger.removeListener(
            "message",
            this.handleMessage
          );
          this.attachPromise = undefined;
        });
        await Promise.all([
          this.send("Page.enable"),
          // Without this, Page.lifecycleEvent never fires and goto would hang.
          this.send("Page.setLifecycleEventsEnabled", { enabled: true }),
          this.send("Runtime.enable")
        ]);
        const tree = await this.send<{
          frameTree: { frame: { id: string } };
        }>("Page.getFrameTree");
        this.mainFrameId = tree.frameTree.frame.id;
        // Make the page believe it is focused even while the window is hidden
        // or occluded, so timers, rAF and IntersectionObserver-driven lazy
        // rendering keep running during headless/background runs. This was the
        // fix that made client-rendered pages (e.g. IMDb charts) scrape
        // reliably; best effort in case a future Electron drops the domain.
        await this.send("Emulation.setFocusEmulationEnabled", {
          enabled: true
        }).catch((): undefined => undefined);
      })();
      this.attachPromise.catch(() => {
        this.attachPromise = undefined;
      });
    }
    return this.attachPromise;
  }

  dispose(): void {
    try {
      this.webContents.debugger.detach();
    } catch {
      // Already detached or the webContents is gone.
    }
  }

  // Evaluate an expression in the page, resolving promises and returning the
  // value by JSON. userGesture lets actions gated on user activation work.
  async evaluate(
    expression: string,
    timeoutMs = EVALUATE_TIMEOUT_MS
  ): Promise<unknown> {
    await this.attach();
    const response = await Promise.race([
      this.send<EvaluateResponse>("Runtime.evaluate", {
        expression,
        returnByValue: true,
        awaitPromise: true,
        userGesture: true
      }),
      sleep(timeoutMs).then((): null => null)
    ]);
    if (response === null) {
      throw new TimeoutError(`Evaluation timed out after ${timeoutMs} ms`);
    }
    if (response.exceptionDetails) {
      throw new Error(
        response.exceptionDetails.exception?.description ??
          response.exceptionDetails.text ??
          "Evaluation failed"
      );
    }
    return response.result?.value;
  }

  async goto(url: string, timeoutMs = 60000): Promise<void> {
    await this.attach();
    const response = await this.send<NavigateResponse>("Page.navigate", {
      url
    });
    // A 4xx/5xx response still renders a document, so it is not a navigation
    // failure (same special case as puppeteer's Frame#goto).
    if (
      response.errorText &&
      response.errorText !== "net::ERR_HTTP_RESPONSE_CODE_FAILURE"
    ) {
      throw new Error(`${response.errorText} at ${url}`);
    }
    // No loaderId means a same-document navigation (e.g. #fragment): done.
    if (!response.loaderId) {
      return;
    }
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const events = this.lifecycle.get(response.loaderId);
      // DOMContentLoaded is enough: operations auto-wait for their selectors,
      // so blocking on full "load" (ads, trackers) only slows runs down.
      if (events?.has("DOMContentLoaded") || events?.has("load")) {
        return;
      }
      await sleep(50);
    }
    throw new TimeoutError(
      `Navigation timeout of ${timeoutMs} ms exceeded: ${url}`
    );
  }

  // Poll for a selector until it exists (and is visible, when asked). Errors
  // from navigations mid-poll (destroyed execution contexts) are swallowed and
  // the poll simply retries, mirroring puppeteer's WaitTask rerun behavior.
  async waitForSelector(
    selector: string,
    { timeoutMs, visible = false }: WaitForSelectorOptions
  ): Promise<void> {
    const check = `(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return false;
      if (!${visible}) return true;
      const style = window.getComputedStyle(el);
      if (style.visibility === "hidden" || style.visibility === "collapse") return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    })()`;
    const deadline = Date.now() + timeoutMs;
    do {
      try {
        if ((await this.evaluate(check, 2000)) === true) {
          return;
        }
      } catch {
        // Transient (navigation swapped the execution context); keep polling.
      }
      await sleep(POLL_INTERVAL_MS);
    } while (Date.now() < deadline);
    throw new TimeoutError(
      `Waiting for selector "${selector}" failed: ${timeoutMs} ms exceeded`
    );
  }

  // Scroll the element into view and return the viewport-clipped center of its
  // first visible client rect — the same clickable-point algorithm as
  // puppeteer's ElementHandle#clickablePoint.
  private async clickablePoint(
    selector: string
  ): Promise<{ x: number; y: number } | null> {
    const point = await this.evaluate(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return null;
      el.scrollIntoView({ block: "center", inline: "center", behavior: "instant" });
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      for (const rect of el.getClientRects()) {
        const x = Math.max(rect.x, 0);
        const y = Math.max(rect.y, 0);
        const width = Math.min(rect.x + rect.width, vw) - x;
        const height = Math.min(rect.y + rect.height, vh) - y;
        if (width >= 1 && height >= 1) {
          return { x: x + width / 2, y: y + height / 2 };
        }
      }
      return null;
    })()`);
    return point as { x: number; y: number } | null;
  }

  // Dispatch trusted mouse events (move, press, release) at the element's
  // center. count > 1 produces double/triple clicks via incrementing
  // clickCount, exactly like puppeteer's Mouse#click.
  async click(selector: string, count = 1): Promise<void> {
    const point = await this.clickablePoint(selector);
    if (!point) {
      throw new Error(`Element "${selector}" is not visible or has no size`);
    }
    await this.send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: point.x,
      y: point.y,
      button: "none",
      buttons: 0
    });
    for (let clickCount = 1; clickCount <= count; clickCount += 1) {
      await this.send("Input.dispatchMouseEvent", {
        type: "mousePressed",
        x: point.x,
        y: point.y,
        button: "left",
        buttons: 1,
        clickCount
      });
      await this.send("Input.dispatchMouseEvent", {
        type: "mouseReleased",
        x: point.x,
        y: point.y,
        button: "left",
        buttons: 0,
        clickCount
      });
    }
  }

  // Type text into the focused element. Printable ASCII goes through real key
  // events (keydown/keypress/input/keyup, which React-style listeners need);
  // anything else (emoji, CJK) is committed IME-style via Input.insertText —
  // the same split puppeteer's Keyboard#type makes.
  async insertText(text: string): Promise<void> {
    for (const char of text) {
      const code = char.charCodeAt(0);
      if (code >= 32 && code <= 126) {
        const virtualKeyCode = /[a-z]/i.test(char)
          ? char.toUpperCase().charCodeAt(0)
          : /[0-9 ]/.test(char)
            ? code
            : 0;
        await this.send("Input.dispatchKeyEvent", {
          type: "keyDown",
          text: char,
          unmodifiedText: char,
          key: char,
          windowsVirtualKeyCode: virtualKeyCode
        });
        await this.send("Input.dispatchKeyEvent", {
          type: "keyUp",
          key: char,
          windowsVirtualKeyCode: virtualKeyCode
        });
      } else {
        await this.send("Input.insertText", { text: char });
      }
    }
  }
}
