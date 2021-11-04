import { BrowserWindow, app } from "electron";
import pie from "puppeteer-in-electron";
import puppeteer, { Browser, Page } from "puppeteer-core";

class ElectronPuppeteer {
  browser: Browser | undefined;
  page: Page | undefined;
  window: BrowserWindow | undefined;

  constructor() {
    pie.initialize(app);
  }

  openBrowser(): void {
    pie.connect(app, puppeteer).then((browser) => {
      this.browser = browser;
    });
  }

  openWindow(): void {
    this.window = new BrowserWindow();
  }

  openPage(): void {
    if (!this.window) {
      this.window = new BrowserWindow();
    }
    if (!this.browser) {
      pie
        .connect(app, puppeteer)
        .then((browser) => {
          this.browser = browser;
          if (!this.window) {
            this.window = new BrowserWindow();
          }
          return pie.getPage(this.browser, this.window);
        })
        .then((page) => {
          this.page = page;
        });
      return;
    }
    pie.getPage(this.browser, this.window).then((page) => {
      this.page = page;
    });
  }

  closeBrowser(): void {
    if (this.browser) {
      this.browser.close();
    }
  }

  closeWindow(): void {
    if (this.window) {
      this.window.close();
    }
  }
}

export default ElectronPuppeteer;
