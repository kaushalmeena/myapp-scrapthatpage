import { app, ipcMain } from "electron";
import Scraper from "../lib/Scraper";
import { executeOperation } from "../utils/scraper";
import { ScraperChannel, ScraperOperation } from "../../common/types/scraper";

export const connectScraperProxy = (scraper: Scraper) => {
  ipcMain.on(ScraperChannel.OPEN_WINDOW, () => {
    scraper.openWindow();
  });
  ipcMain.on(ScraperChannel.CLOSE_WINDOW, () => {
    scraper.closeWindow();
  });
  ipcMain.handle(ScraperChannel.GET_VERSION, () => app.getVersion());
  ipcMain.handle(ScraperChannel.LOAD_URL, (_, url: string) =>
    scraper.loadURL(url)
  );
  ipcMain.handle(ScraperChannel.RUN_JAVASCRIPT, (_, code: string) =>
    scraper.executeJavascript(code)
  );
  ipcMain.handle(
    ScraperChannel.RUN_OPERATION,
    (_, operation: ScraperOperation) => executeOperation(operation, scraper)
  );
};

export const disconnectScraperProxy = () => {
  ipcMain.removeAllListeners(ScraperChannel.OPEN_WINDOW);
  ipcMain.removeAllListeners(ScraperChannel.CLOSE_WINDOW);
  ipcMain.removeHandler(ScraperChannel.GET_VERSION);
  ipcMain.removeHandler(ScraperChannel.LOAD_URL);
  ipcMain.removeHandler(ScraperChannel.RUN_JAVASCRIPT);
  ipcMain.removeHandler(ScraperChannel.RUN_OPERATION);
};
