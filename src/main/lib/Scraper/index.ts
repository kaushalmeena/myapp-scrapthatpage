import type { ScraperConfig } from "@common/types/scraper";
import { BrowserWindow } from "electron";
import DebuggerPage from "./DebuggerPage";

// Auto-wait budget for an element to appear before an operation acts on it.
const ACTION_TIMEOUT_MS = 10000;

// How long the element picker waits for the user to click something.
const PICK_TIMEOUT_MS = 60000;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Drives a dedicated child BrowserWindow over the Chrome DevTools Protocol via
 * webContents.debugger (in-process — works in packaged/signed builds, unlike a
 * remote debugging port). DebuggerPage supplies Puppeteer-style auto-waiting
 * primitives, so operations tolerate content that renders after navigation.
 */
export default class Scraper {
  private mainWindow: BrowserWindow;

  private scraperWindow?: BrowserWindow;

  private page?: DebuggerPage;

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
  private async getPage(): Promise<DebuggerPage> {
    const window = this.ensureWindow();
    // A fresh window has no committed document yet, and CDP commands sent to
    // it never resolve (same quirk puppeteer-in-electron works around with
    // allowBlankNavigate). Commit about:blank before attaching.
    if (!window.webContents.getURL()) {
      await window.webContents.loadURL("about:blank");
    }
    if (!this.page) {
      this.page = new DebuggerPage(window.webContents);
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
  // selector for it, using Chromium's native "inspect element" overlay. Times
  // out after PICK_TIMEOUT_MS or if the window closes.
  async pickElement(): Promise<string> {
    if (!this.getActiveURL()) {
      throw new Error("Open a page in the scraper window before picking.");
    }
    const page = await this.getPage();
    this.scraperWindow?.show();
    this.scraperWindow?.focus();
    try {
      return await page.pickElement(PICK_TIMEOUT_MS);
    } finally {
      // Dismiss the scraper window once picking ends (picked or cancelled) so
      // it doesn't linger over the editor. Hidden, not closed, so the next
      // pick reuses the warm window/page.
      if (this.scraperWindow && !this.scraperWindow.isDestroyed()) {
        this.scraperWindow.hide();
      }
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
