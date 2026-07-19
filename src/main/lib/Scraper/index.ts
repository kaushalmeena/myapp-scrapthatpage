import { BrowserWindow } from "electron";
import { ScraperConfig } from "../../../common/types/scraper";
import CdpPage from "./CdpPage";

// Auto-wait budget for an element to appear before an operation acts on it.
const ACTION_TIMEOUT_MS = 10000;

// Injected into the scraped page for the element picker. Highlights the hovered
// element and, on click, stores a CSS selector for it on window.__pickerResult
// (polled from the main process). Skips framework-generated class names so
// picked selectors survive redeploys.
const PICKER_SCRIPT = `
(() => {
  if (window.__pickerActive) return;
  window.__pickerActive = true;
  window.__pickerResult = null;
  const prev = { el: null, outline: "" };
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
  const selectorFor = (el) => {
    const parts = [];
    for (let node = el; node && node.nodeType === 1 && node.tagName !== "HTML"; node = node.parentElement) {
      if (node.id && document.querySelectorAll("#" + CSS.escape(node.id)).length === 1) {
        parts.unshift("#" + CSS.escape(node.id));
        return parts.join(" > ");
      }
      parts.unshift(segmentFor(node));
      const candidate = parts.join(" > ");
      const matches = document.querySelectorAll(candidate);
      if (matches.length === 1 && matches[0] === el) {
        return candidate;
      }
    }
    return parts.join(" > ");
  };
  const restore = () => {
    if (prev.el) prev.el.style.outline = prev.outline;
    prev.el = null;
  };
  const cleanup = () => {
    restore();
    document.removeEventListener("mouseover", over, true);
    document.removeEventListener("click", click, true);
    window.__pickerActive = false;
  };
  const over = (e) => {
    restore();
    prev.el = e.target;
    prev.outline = e.target.style.outline;
    e.target.style.outline = "2px solid #e11d48";
  };
  const click = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.__pickerResult = selectorFor(e.target);
    cleanup();
  };
  document.addEventListener("mouseover", over, true);
  document.addEventListener("click", click, true);
  window.__pickerCancel = cleanup;
})();
`;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Drives a dedicated child BrowserWindow over the Chrome DevTools Protocol via
// webContents.debugger (in-process — works in packaged/signed builds, unlike a
// remote debugging port). CdpPage supplies Puppeteer-style auto-waiting
// primitives, so operations tolerate content that renders after navigation.
class Scraper {
  private mainWindow: BrowserWindow;

  private scraperWindow?: BrowserWindow;

  private page?: CdpPage;

  private config: ScraperConfig = { showWindow: true };

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  configure(config: ScraperConfig): void {
    this.config = config;
    if (this.scraperWindow && !this.scraperWindow.isDestroyed()) {
      if (config.showWindow) {
        this.scraperWindow.show();
      } else {
        this.scraperWindow.hide();
      }
    }
  }

  private ensureWindow(): BrowserWindow {
    if (!this.scraperWindow || this.scraperWindow.isDestroyed()) {
      this.scraperWindow = new BrowserWindow({
        title: "Scraper",
        parent: this.mainWindow,
        show: this.config.showWindow,
        webPreferences: {
          // Loads arbitrary third-party pages, so keep it locked down.
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: true,
          webSecurity: true,
          allowRunningInsecureContent: false,
          // Keep rendering/timers alive while hidden or backgrounded so lazily
          // rendered pages still finish loading.
          backgroundThrottling: false
        }
      });
      // Deny pop-ups from scraped pages; navigation within the window is fine.
      this.scraperWindow.webContents.setWindowOpenHandler(() => ({
        action: "deny"
      }));
      this.scraperWindow.once("closed", () => {
        this.page?.dispose();
        this.scraperWindow = undefined;
        this.page = undefined;
      });
    }
    return this.scraperWindow;
  }

  // Returns the CDP page bound to the scraper window, attaching lazily.
  private async getPage(): Promise<CdpPage> {
    const window = this.ensureWindow();
    // A fresh window has no committed document yet, and CDP commands sent to
    // it never resolve (same quirk puppeteer-in-electron works around with
    // allowBlankNavigate). Commit about:blank before attaching.
    if (!window.webContents.getURL()) {
      await window.webContents.loadURL("about:blank");
    }
    if (!this.page) {
      this.page = new CdpPage(window.webContents);
    }
    await this.page.attach();
    return this.page;
  }

  getActiveURL(): string {
    if (!this.scraperWindow || this.scraperWindow.isDestroyed()) {
      return "";
    }
    return this.scraperWindow.webContents.getURL();
  }

  async loadURL(url: string): Promise<void> {
    const page = await this.getPage();
    await page.goto(url);
  }

  // Escape hatch used by the RUN_JAVASCRIPT channel.
  async executeJavascript(code: string): Promise<unknown> {
    const page = await this.getPage();
    return page.evaluate(code);
  }

  async extract(selector: string, attribute: string): Promise<string[]> {
    const page = await this.getPage();
    // Wait for the target to appear; non-fatal so an optional/empty extract
    // returns [] instead of erroring.
    await page
      .waitForSelector(selector, { timeoutMs: ACTION_TIMEOUT_MS })
      .catch((): null => null);
    const data = await page.evaluate(
      `Array.from(document.querySelectorAll(${JSON.stringify(selector)}))
        .map((el) => String(el[${JSON.stringify(attribute)}] ?? ""))`
    );
    return Array.isArray(data) ? data.map(String) : [];
  }

  async click(selector: string): Promise<void> {
    const page = await this.getPage();
    // Wait until the element is visible and actionable, then dispatch trusted
    // mouse events at its center.
    await page.waitForSelector(selector, {
      timeoutMs: ACTION_TIMEOUT_MS,
      visible: true
    });
    await page.click(selector);
  }

  async type(selector: string, text: string): Promise<void> {
    const page = await this.getPage();
    await page.waitForSelector(selector, {
      timeoutMs: ACTION_TIMEOUT_MS,
      visible: true
    });
    // Triple-click selects any existing value so typing replaces it.
    await page.click(selector, 3);
    await page.insertText(text);
  }

  async waitFor(selector: string, timeoutMs: number): Promise<void> {
    const page = await this.getPage();
    await page.waitForSelector(selector, { timeoutMs });
  }

  delay(ms: number): Promise<void> {
    // Cap runaway delays at 5 minutes to keep the runner responsive.
    return sleep(Math.min(ms, 300000));
  }

  async scroll(selector: string): Promise<void> {
    const page = await this.getPage();
    if (selector) {
      await page
        .waitForSelector(selector, { timeoutMs: ACTION_TIMEOUT_MS })
        .catch((): null => null);
      await page
        .evaluate(
          `document.querySelector(${JSON.stringify(selector)})
            ?.scrollIntoView({ behavior: "instant", block: "center" })`
        )
        .catch((): null => null);
      return;
    }
    // No selector: repeatedly scroll to the bottom to trigger lazy/infinite
    // loading, stopping once the page height stops growing or after ~15s. A
    // minimum runtime keeps the loop alive through the post-navigation
    // hydration lull, where the height looks stable because the page hasn't
    // rendered its real content yet. Each scroll step is bounded (evaluate
    // timeout) so a page that stalls mid-run can't hang the whole operation.
    let lastHeight = -1;
    let stableTicks = 0;
    const start = Date.now();
    const deadline = start + 15000;
    while (
      Date.now() < deadline &&
      (stableTicks < 3 || Date.now() - start < 4000)
    ) {
      const height = await page
        .evaluate(
          "window.scrollTo(0, document.body.scrollHeight); document.body.scrollHeight",
          1500
        )
        .catch((): null => null);
      if (typeof height !== "number") {
        // The scroll step stalled; stop rather than hang.
        break;
      }
      if (height === lastHeight) {
        stableTicks += 1;
      } else {
        stableTicks = 0;
        lastHeight = height;
      }
      await sleep(500);
    }
  }

  // Lets the user click an element in the scraper window and returns a CSS
  // selector for it. Times out after 60s or if the window closes.
  async pickElement(): Promise<string> {
    if (!this.getActiveURL()) {
      throw new Error("Open a page in the scraper window before picking.");
    }
    const page = await this.getPage();
    this.scraperWindow?.show();
    this.scraperWindow?.focus();
    await page.evaluate(PICKER_SCRIPT);
    const deadline = Date.now() + 60000;
    try {
      while (Date.now() < deadline) {
        if (!this.scraperWindow || this.scraperWindow.isDestroyed()) {
          throw new Error("Scraper window was closed while picking.");
        }
        const result = await page.evaluate("window.__pickerResult");
        if (typeof result === "string" && result.length > 0) {
          await page.evaluate("window.__pickerResult = null");
          return result;
        }
        await sleep(250);
      }
      throw new Error("Timed out waiting for an element to be picked.");
    } finally {
      await page
        .evaluate("window.__pickerCancel && window.__pickerCancel()")
        .catch((): undefined => undefined);
    }
  }

  openWindow(): void {
    this.ensureWindow();
  }

  closeWindow(): void {
    if (this.scraperWindow && !this.scraperWindow.isDestroyed()) {
      this.scraperWindow.close();
    }
  }
}

export default Scraper;
