import type { WebContents } from "electron";

/**
 * Minimal Puppeteer-style Page driver built on Electron's in-process debugger
 * (webContents.debugger, which speaks the Chrome DevTools Protocol). Unlike
 * puppeteer-in-electron this needs no --remote-debugging-port, so it works in
 * signed/packaged builds where the OS blocks remote debugging. The techniques
 * mirror puppeteer-core's cdp/ layer:
 *  - goto: Page.navigate + lifecycle tracking per loaderId (LifecycleWatcher)
 *  - waitForSelector: polling that swallows transient context-destroyed errors
 *  - click: scrollIntoView + getClientRects center + Input.dispatchMouseEvent
 *  - type: Input.dispatchKeyEvent for ASCII, Input.insertText for the rest
 */

export class TimeoutError extends Error {}

// Thrown when the user presses Esc during an element pick — a deliberate abort,
// not a failure, so callers can stay silent instead of showing an error.
export class PickCancelledError extends Error {}

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

// One caller awaiting a single CDP event (see waitForEvent). Kept in a set so
// they can all be rejected at once if the debugger detaches mid-wait.
interface EventWaiter {
  method: string;
  resolve: (params: Record<string, unknown>) => void;
  reject: (error: Error) => void;
}

// Colors for Chromium's native inspect overlay, matching DevTools' element
// inspector (blue content, green padding, orange margin) so the picker looks
// like the tool users already know.
const INSPECT_HIGHLIGHT = {
  showInfo: true,
  contentColor: { r: 111, g: 168, b: 220, a: 0.66 },
  paddingColor: { r: 147, g: 196, b: 125, a: 0.55 },
  borderColor: { r: 255, g: 229, b: 153, a: 0.66 },
  marginColor: { r: 246, g: 178, b: 107, a: 0.66 }
};

// Runs on the picked element (bound as `this` via Runtime.callFunctionOn) and
// builds the shortest unique CSS selector for it. Framework-generated class
// names are skipped so picked selectors survive redeploys; a unique id short-
// circuits to "#id", otherwise it walks up appending tag/class/:nth-of-type
// segments until the selector matches exactly one node.
const SELECTOR_FUNCTION = `function () {
  const isStableClass = (c) => {
    if (/^(sc-|css-|jsx-|emotion-)/.test(c)) return false;
    if (/^[a-z]+-[0-9a-f]{5,}$/i.test(c)) return false;
    if (/[A-Z]/.test(c) && !/[-_]/.test(c) && c.length <= 8) return false;
    return true;
  };
  const segmentFor = (node) => {
    let seg = node.tagName.toLowerCase();
    const classes = Array.from(node.classList).filter(isStableClass).slice(0, 2);
    if (classes.length > 0) {
      seg += "." + classes.map((c) => CSS.escape(c)).join(".");
    }
    const parent = node.parentElement;
    if (parent) {
      const sameTag = Array.from(parent.children).filter((c) => c.tagName === node.tagName);
      if (sameTag.length > 1) {
        seg += ":nth-of-type(" + (sameTag.indexOf(node) + 1) + ")";
      }
    }
    return seg;
  };
  const parts = [];
  for (let node = this; node && node.nodeType === 1 && node.tagName !== "HTML"; node = node.parentElement) {
    if (node.id && document.querySelectorAll("#" + CSS.escape(node.id)).length === 1) {
      parts.unshift("#" + CSS.escape(node.id));
      return parts.join(" > ");
    }
    parts.unshift(segmentFor(node));
    const candidate = parts.join(" > ");
    const matches = document.querySelectorAll(candidate);
    if (matches.length === 1 && matches[0] === this) {
      return candidate;
    }
  }
  return parts.join(" > ");
}`;

// Injected banner shown across the top of the scraped page while picking, since
// that window shows a third-party site and can't render our own UI. Keyboard
// hints match the before-input-event handlers in pickElement. pointerEvents is
// "none" so the banner is never itself highlighted or picked, and clicks/hover
// hit-test straight through to the elements beneath it.
const PICK_HINT_ID = "__stp_pick_hint";
const PICK_HINT_SCRIPT = `(() => {
  if (document.getElementById(${JSON.stringify(PICK_HINT_ID)})) return;
  const bar = document.createElement("div");
  bar.id = ${JSON.stringify(PICK_HINT_ID)};
  bar.textContent = "Click an element to capture its selector  ·  Hold Shift to interact with the page (scroll, follow links)  ·  Esc to cancel";
  Object.assign(bar.style, {
    position: "fixed", top: "0", left: "0", right: "0",
    zIndex: "2147483647", padding: "10px 16px",
    background: "#1447E6", color: "#ffffff",
    font: "600 13px system-ui, -apple-system, sans-serif",
    textAlign: "center", letterSpacing: ".01em",
    pointerEvents: "none", boxShadow: "0 1px 6px rgba(0,0,0,.35)"
  });
  (document.body || document.documentElement).appendChild(bar);
})();`;
const PICK_HINT_REMOVE = `(() => {
  const el = document.getElementById(${JSON.stringify(PICK_HINT_ID)});
  if (el) el.remove();
})();`;

// Electron before-input-event payload (only the fields the picker reads).
interface KeyInput {
  type: string;
  key: string;
}

export default class DebuggerPage {
  private webContents: WebContents;

  private attachPromise?: Promise<void>;

  private mainFrameId = "";

  private currentLoaderId = "";

  // Lifecycle event names seen per loaderId (document load). Puppeteer's
  // LifecycleWatcher keeps the same structure on its Frame objects.
  private lifecycle = new Map<string, Set<string>>();

  // Callers parked in waitForEvent, awaiting a one-shot CDP event.
  private pendingEvents = new Set<EventWaiter>();

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
    // Fan the raw event out to any one-shot waiters (e.g. the element picker
    // parked on Overlay.inspectNodeRequested).
    for (const waiter of [...this.pendingEvents]) {
      if (waiter.method === method) {
        waiter.resolve(params);
      }
    }
  };

  // Resolves with the params of the next `method` event, or rejects if the
  // debugger detaches or the timeout elapses first.
  private waitForEvent<T>(method: string, timeoutMs: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      let timer: ReturnType<typeof setTimeout>;
      const waiter: EventWaiter = {
        method,
        resolve: (params) => {
          clearTimeout(timer);
          this.pendingEvents.delete(waiter);
          resolve(params as T);
        },
        reject: (error) => {
          clearTimeout(timer);
          this.pendingEvents.delete(waiter);
          reject(error);
        }
      };
      timer = setTimeout(
        () =>
          waiter.reject(
            new TimeoutError(
              `Timed out waiting for ${method} after ${timeoutMs} ms`
            )
          ),
        timeoutMs
      );
      this.pendingEvents.add(waiter);
    });
  }

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
          // Nothing more will arrive; fail any parked waiters (e.g. a picker
          // still running when the scraper window is closed).
          for (const waiter of [...this.pendingEvents]) {
            waiter.reject(
              new Error("Scraper window was closed while picking.")
            );
          }
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

  private armInspect(): Promise<void> {
    return this.send<void>("Overlay.setInspectMode", {
      mode: "searchForNode",
      highlightConfig: INSPECT_HIGHLIGHT
    }).catch((): undefined => undefined);
  }

  private disarmInspect(): Promise<void> {
    // mode "none" still requires highlightConfig in this Chromium build, or the
    // command is rejected and inspect mode stays armed.
    return this.send<void>("Overlay.setInspectMode", {
      mode: "none",
      highlightConfig: INSPECT_HIGHLIGHT
    }).catch((): undefined => undefined);
  }

  // Turn on Chromium's native "inspect element" mode — the same overlay
  // DevTools shows — and resolve with a CSS selector for the element the user
  // clicks. Unlike an injected highlighter this paints the overlay out of
  // process, so it never mutates the page or fights its styles.
  //
  // Holding Shift disarms inspect mode so clicks fall through to the page
  // (scroll, expand menus, follow links) instead of selecting; releasing it
  // re-arms. Esc cancels. A pointer-events:none banner (re-injected after
  // navigations) explains this in the scraper window itself. Rejects on
  // timeout, on Esc, or if the window is closed mid-pick.
  async pickElement(timeoutMs: number): Promise<string> {
    await this.attach();
    await Promise.all([this.send("DOM.enable"), this.send("Overlay.enable")]);

    let passthrough = false;
    let cancel: (() => void) | undefined;
    const injectHint = () =>
      this.evaluate(PICK_HINT_SCRIPT).catch((): undefined => undefined);

    const onInput = (_event: unknown, input: KeyInput): void => {
      if (input.key === "Shift") {
        const wantPassthrough = input.type === "keyDown";
        if (wantPassthrough !== passthrough) {
          passthrough = wantPassthrough;
          void (wantPassthrough ? this.disarmInspect() : this.armInspect());
        }
      } else if (input.key === "Escape" && input.type === "keyDown") {
        cancel?.();
      }
    };
    // A navigation swaps the document, dropping the banner and the overlay; put
    // both back (unless the user is mid-interaction with Shift held).
    const onDomReady = (): void => {
      void injectHint();
      if (!passthrough) {
        void this.armInspect();
      }
    };
    this.webContents.on("before-input-event", onInput);
    this.webContents.on("dom-ready", onDomReady);

    try {
      await injectHint();
      await this.armInspect();
      const backendNodeId = await new Promise<number>((resolve, reject) => {
        cancel = () =>
          reject(new PickCancelledError("Element pick cancelled."));
        this.waitForEvent<{ backendNodeId: number }>(
          "Overlay.inspectNodeRequested",
          timeoutMs
        ).then((params) => resolve(params.backendNodeId), reject);
      });
      // Resolve the picked node to a JS handle and compute its selector in the
      // page, reusing document.querySelectorAll to verify uniqueness.
      const { object } = await this.send<{ object: { objectId: string } }>(
        "DOM.resolveNode",
        { backendNodeId }
      );
      const response = await this.send<EvaluateResponse>(
        "Runtime.callFunctionOn",
        {
          objectId: object.objectId,
          functionDeclaration: SELECTOR_FUNCTION,
          returnByValue: true
        }
      );
      const selector = response.result?.value;
      if (typeof selector !== "string" || selector.length === 0) {
        throw new Error("Could not build a selector for the picked element.");
      }
      return selector;
    } finally {
      this.webContents.removeListener("before-input-event", onInput);
      this.webContents.removeListener("dom-ready", onDomReady);
      await this.evaluate(PICK_HINT_REMOVE).catch((): undefined => undefined);
      await this.disarmInspect();
      await this.send("Overlay.disable").catch((): undefined => undefined);
    }
  }
}
