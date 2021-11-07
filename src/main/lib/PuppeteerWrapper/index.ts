import { BrowserWindow, app } from "electron";
import pie from "puppeteer-in-electron";
import puppeteer, { Browser, Page } from "puppeteer-core";

class PuppeteerWrapper {
  private browser?: Browser;
  private window?: BrowserWindow;
  private page?: Page;

  constructor() {
    pie.initialize(app);
  }

  async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await pie.connect(app, puppeteer);
    }
    return this.browser;
  }

  getWindow(): BrowserWindow {
    if (!this.window) {
      this.window = new BrowserWindow({ title: "Scraper" });
      this.window.once("close", () => {
        this.window = undefined;
      });
    }
    return this.window;
  }

  async getPage(): Promise<Page> {
    if (!this.page || this.page.isClosed()) {
      const browser = await this.getBrowser();
      const window = this.getWindow();
      this.page = await pie.getPage(browser, window);
    }
    return this.page;
  }

  async openBrowser(): Promise<void> {
    this.browser = await this.getBrowser();
  }

  openWindow(): void {
    this.window = this.getWindow();
  }

  async openPage(): Promise<void> {
    this.page = await this.getPage();
  }

  closeBrowser(): void {
    if (this.browser) {
      this.browser.close();
      this.browser = undefined;
    }
  }

  closeWindow(): void {
    if (this.window) {
      this.window.close();
      this.window = undefined;
    }
  }

  closePage(): void {
    if (this.page) {
      this.page.close();
      this.page = undefined;
    }
  }
}

export default PuppeteerWrapper;
