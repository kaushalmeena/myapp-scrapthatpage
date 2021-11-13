import { ipcMain } from "electron";
import { SCRAPER_CHANNELS } from "../../common/constants/scraper";
import { ScraperOperation, ExecuteResult } from "../../common/types/scraper";
import PuppeteerWrapper from "../lib/PuppeteerWrapper";
import { executeOperation } from "../utils/scraper";

export const connectScraperProxy = (puppeteer: PuppeteerWrapper): void => {
  ipcMain.on(SCRAPER_CHANNELS.OPEN_WINDOW, () => {
    puppeteer.openWindow();
  });
  ipcMain.on(SCRAPER_CHANNELS.CLOSE_WINDOW, () => {
    puppeteer.closeWindow();
  });
  ipcMain.handle(
    SCRAPER_CHANNELS.RUN_OPERATION,
    async (event, operation: ScraperOperation): Promise<ExecuteResult> => {
      try {
        const page = await puppeteer.getPage();
        const result = await executeOperation(page, operation);
        return {
          status: "success",
          data: result
        };
      } catch (err) {
        console.log(err);
        return {
          status: "error",
          message: "Error occured in executing operation"
        };
      }
    }
  );
};

export const disconnectScraperProxy = (): void => {
  ipcMain.removeAllListeners(SCRAPER_CHANNELS.OPEN_WINDOW);
  ipcMain.removeAllListeners(SCRAPER_CHANNELS.CLOSE_WINDOW);
  ipcMain.removeHandler(SCRAPER_CHANNELS.RUN_OPERATION);
};
