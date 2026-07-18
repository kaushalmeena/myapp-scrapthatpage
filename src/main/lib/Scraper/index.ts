import { BrowserWindow } from "electron";
import { ScraperConfig } from "../../../common/types/scraper";

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Injected into the scraped page to let the user pick an element. Highlights
// the hovered element and, on click, stores a CSS selector for it on
// window.__pickerResult (polled from the main process). Runs in the sandboxed
// scraper page; it never receives data from the app.
const PICKER_SCRIPT = `
(() => {
  if (window.__pickerActive) return;
  window.__pickerActive = true;
  window.__pickerResult = null;
  const prev = { el: null, outline: "" };
  const selectorFor = (el) => {
    const parts = [];
    for (let node = el; node && node.nodeType === 1 && node.tagName !== "HTML"; node = node.parentElement) {
      if (node.id) {
        parts.unshift("#" + CSS.escape(node.id));
        break;
      }
      let part = node.tagName.toLowerCase();
      const stableClasses = Array.from(node.classList).slice(0, 2);
      if (stableClasses.length > 0) {
        part += "." + stableClasses.map((c) => CSS.escape(c)).join(".");
      }
      const parent = node.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter((c) => c.tagName === node.tagName);
        if (siblings.length > 1) {
          part += ":nth-of-type(" + (siblings.indexOf(node) + 1) + ")";
        }
      }
      parts.unshift(part);
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

class Scraper {
  private mainWindow: BrowserWindow;

  private scraperWindow?: BrowserWindow;

  private config: ScraperConfig = { showWindow: true };

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  configure(config: ScraperConfig): void {
    this.config = config;
    if (this.scraperWindow) {
      if (config.showWindow) {
        this.scraperWindow.show();
      } else {
        this.scraperWindow.hide();
      }
    }
  }

  getWindow(): BrowserWindow {
    if (!this.scraperWindow) {
      this.scraperWindow = new BrowserWindow({
        title: "Scraper",
        parent: this.mainWindow,
        show: this.config.showWindow,
        webPreferences: {
          // The scraper window loads arbitrary third-party pages, so keep it
          // locked down: no Node.js access, isolated context, sandboxed.
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: true,
          webSecurity: true,
          allowRunningInsecureContent: false
        }
      });
      // Scraped pages may try to open pop-ups; deny them. Navigation within the
      // window is left unrestricted since following links is core to scraping.
      this.scraperWindow.webContents.setWindowOpenHandler(() => ({
        action: "deny"
      }));
      this.scraperWindow.once("closed", () => {
        this.scraperWindow = undefined;
      });
    }
    return this.scraperWindow;
  }

  getActiveURL(): string {
    return this.scraperWindow?.webContents.getURL() ?? "";
  }

  loadURL(url: string): Promise<void> {
    return this.getWindow().webContents.loadURL(url);
  }

  executeJavascript(code: string): Promise<unknown> {
    return this.getWindow().webContents.executeJavaScript(code);
  }

  // Polls the page until the selector matches an element, so operations can
  // cope with content that loads after navigation.
  async waitForSelector(selector: string, timeoutMs: number): Promise<void> {
    const deadline = Date.now() + timeoutMs;
    for (;;) {
      const found = await this.executeJavascript(
        `Boolean(document.querySelector(${JSON.stringify(selector)}))`
      );
      if (found) {
        return;
      }
      if (Date.now() >= deadline) {
        throw new Error(
          `Timed out after ${timeoutMs}ms waiting for selector "${selector}"`
        );
      }
      await sleep(250);
    }
  }

  delay(ms: number): Promise<void> {
    // Cap runaway delays at 5 minutes to keep the runner responsive.
    return sleep(Math.min(ms, 300000));
  }

  scroll(selector: string): Promise<unknown> {
    if (selector) {
      return this.executeJavascript(
        `document.querySelector(${JSON.stringify(
          selector
        )}).scrollIntoView({ behavior: "instant", block: "center" });`
      );
    }
    return this.executeJavascript(
      "window.scrollTo(0, document.body.scrollHeight);"
    );
  }

  // Lets the user click an element in the scraper window and returns a CSS
  // selector for it. Times out after 60s or when the window closes.
  async pickElement(): Promise<string> {
    if (!this.getActiveURL()) {
      throw new Error("Open a page in the scraper window before picking.");
    }
    const window = this.getWindow();
    window.show();
    window.focus();
    await this.executeJavascript(PICKER_SCRIPT);
    const deadline = Date.now() + 60000;
    try {
      while (Date.now() < deadline) {
        if (!this.scraperWindow) {
          throw new Error("Scraper window was closed while picking.");
        }
        const result = await this.executeJavascript("window.__pickerResult");
        if (typeof result === "string" && result.length > 0) {
          await this.executeJavascript("window.__pickerResult = null;");
          return result;
        }
        await sleep(250);
      }
      throw new Error("Timed out waiting for an element to be picked.");
    } finally {
      // Always remove the page listeners, even on timeout or window close.
      await this.executeJavascript(
        "window.__pickerCancel && window.__pickerCancel();"
      ).catch((): undefined => undefined);
    }
  }

  openWindow(): void {
    this.getWindow();
  }

  closeWindow(): void {
    if (this.scraperWindow) {
      this.scraperWindow.close();
    }
  }
}

export default Scraper;
