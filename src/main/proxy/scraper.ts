import { ipcMain } from "electron";
import { SCRAPER_ACTIONS } from "../../common/constants/scraper";
import { ScraperOperation, ScraperResult } from "../../common/types/scraper";
import PuppeteerWrapper from "../lib/PuppeteerWrapper";
import { executeOperation } from "../utils/scraper";

export const connectScraperProxy = (puppeteer: PuppeteerWrapper): void => {
  ipcMain.handle(
    SCRAPER_ACTIONS.RUN_OPERATION,
    async (event, operation: ScraperOperation): Promise<ScraperResult> => {
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
