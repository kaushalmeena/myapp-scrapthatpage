import { app, ipcMain } from "electron";
import { ScraperChannels } from "../../common/constants/scraper";
import { ScraperOperation } from "../../common/types/scraper";
import Scraper from "../lib/Scraper";
import { executeOperation } from "../utils/scraper";

export const connectScraperProxy = (scraper: Scraper) => {
  ipcMain.on(ScraperChannels.OPEN_WINDOW, () => {
    scraper.openWindow();
  });
  ipcMain.on(ScraperChannels.CLOSE_WINDOW, () => {
    scraper.closeWindow();
  });
  ipcMain.handle(ScraperChannels.GET_VERSION, () => app.getVersion());
  ipcMain.handle(ScraperChannels.LOAD_URL, (_, url: string) =>
    scraper.loadURL(url)
  );
  ipcMain.handle(ScraperChannels.RUN_JAVASCRIPT, (_, code: string) =>
    scraper.executeJavascript(code)
  );
  ipcMain.handle(
    ScraperChannels.RUN_OPERATION,
    (_, operation: ScraperOperation) => executeOperation(operation, scraper)
  );
};

export const disconnectScraperProxy = () => {
  ipcMain.removeAllListeners(ScraperChannels.OPEN_WINDOW);
  ipcMain.removeAllListeners(ScraperChannels.CLOSE_WINDOW);
  ipcMain.removeHandler(ScraperChannels.GET_VERSION);
  ipcMain.removeHandler(ScraperChannels.LOAD_URL);
  ipcMain.removeHandler(ScraperChannels.RUN_JAVASCRIPT);
  ipcMain.removeHandler(ScraperChannels.RUN_OPERATION);
};
