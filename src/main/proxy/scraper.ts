import { ipcMain } from "electron";
import { SCRAPER_CHANNELS } from "../../common/constants/scraper";
import { ExecuteResult, ScraperOperation } from "../../common/types/scraper";
import Scraper from "../lib/Scraper";
import { handleExecuteOperation } from "../utils/scraper";

export const connectScraperProxy = (scraper: Scraper): void => {
  ipcMain.on(SCRAPER_CHANNELS.OPEN_WINDOW, () => {
    scraper.openWindow();
  });
  ipcMain.on(SCRAPER_CHANNELS.CLOSE_WINDOW, () => {
    scraper.closeWindow();
  });
  ipcMain.handle(SCRAPER_CHANNELS.LOAD_URL, (_, url: string) =>
    scraper.loadURL(url)
  );
  ipcMain.handle(SCRAPER_CHANNELS.RUN_JAVASCRIPT, (_, code: string) =>
    scraper.executeJavascript(code)
  );
  ipcMain.handle(
    SCRAPER_CHANNELS.RUN_OPERATION,
    async (_, operation: ScraperOperation): Promise<ExecuteResult> =>
      handleExecuteOperation(scraper, operation)
  );
};

export const disconnectScraperProxy = (): void => {
  ipcMain.removeAllListeners(SCRAPER_CHANNELS.OPEN_WINDOW);
  ipcMain.removeAllListeners(SCRAPER_CHANNELS.CLOSE_WINDOW);
  ipcMain.removeHandler(SCRAPER_CHANNELS.LOAD_URL);
  ipcMain.removeHandler(SCRAPER_CHANNELS.RUN_JAVASCRIPT);
  ipcMain.removeHandler(SCRAPER_CHANNELS.RUN_OPERATION);
};
