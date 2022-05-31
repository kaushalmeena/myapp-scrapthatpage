import { BrowserWindow } from "electron";

class Scraper {
  private mainWindow: BrowserWindow;

  private scraperWindow?: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  getWindow(): BrowserWindow {
    if (!this.scraperWindow) {
      this.scraperWindow = new BrowserWindow({
        title: "Scraper",
        parent: this.mainWindow
      });
      this.scraperWindow.once("closed", () => {
        this.scraperWindow = undefined;
      });
    }
    return this.scraperWindow;
  }

  getActiveURL(): string {
    if (!this.scraperWindow) {
      return "";
    }
    return this.scraperWindow.webContents.getURL();
  }

  loadURL(url: string): Promise<void> {
    if (!this.scraperWindow) {
      this.scraperWindow = this.getWindow();
    }
    return this.scraperWindow.webContents.loadURL(url);
  }

  executeJavascript(code: string): Promise<unknown> {
    if (!this.scraperWindow) {
      this.scraperWindow = this.getWindow();
    }
    return this.scraperWindow.webContents.executeJavaScript(code);
  }

  openWindow(): void {
    this.scraperWindow = this.getWindow();
  }

  closeWindow(): void {
    if (this.scraperWindow) {
      this.scraperWindow.close();
    }
  }
}

export default Scraper;
