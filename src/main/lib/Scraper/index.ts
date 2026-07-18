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
        parent: this.mainWindow,
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
