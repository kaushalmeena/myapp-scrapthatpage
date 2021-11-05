import { BrowserWindow, app } from "electron";
import pie from "puppeteer-in-electron";
import puppeteer, { Browser, Page } from "puppeteer-core";

class ElectronPuppeteer {
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
    }
    return this.window;
  }

  async getPage(): Promise<Page> {
    if (!this.page) {
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
    }
  }

  closeWindow(): void {
    if (this.window) {
      this.window.close();
    }
  }

  closePage(): void {
    if (this.page) {
      this.page.close();
    }
  }
}

export default ElectronPuppeteer;
