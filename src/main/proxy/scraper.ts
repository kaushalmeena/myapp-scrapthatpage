import { ipcMain } from "electron";
import { Page } from "puppeteer-core";
import { OPERATION_TYPES } from "../../common/constants/operation";
import { SCRAPER_ACTIONS } from "../../common/constants/scraper";
import { OperationReturn } from "../../common/types/scraper";
import { SmallOperation } from "../../common/types/smallOperation";
import ElectronPuppeteer from "../lib/ElectronPuppeteer";

export const connectScraperProxy = (puppeteer: ElectronPuppeteer): void => {
  ipcMain.on(SCRAPER_ACTIONS.OPEN_BROWSER, () => {
    puppeteer.openBrowser();
  });
  ipcMain.on(SCRAPER_ACTIONS.OPEN_WINDOW, () => {
    puppeteer.openWindow();
  });
  ipcMain.on(SCRAPER_ACTIONS.CLOSE_BROWSER, () => {
    puppeteer.closeBrowser();
  });
  ipcMain.on(SCRAPER_ACTIONS.CLOSE_WINDOW, () => {
    puppeteer.closeWindow();
  });
  ipcMain.on(SCRAPER_ACTIONS.OPEN_PAGE, () => {
    puppeteer.openPage();
  });
  ipcMain.handle(
    SCRAPER_ACTIONS.RUN_OPERATION,
    async (event, operation: SmallOperation): Promise<OperationReturn> => {
      try {
        const result = await executeOperation(puppeteer.page, operation);
        return {
          status: "success",
          data: result
        };
      } catch (err) {
        console.log(err);
        return {
          status: "error",
          message: "Error occureed in executing operartion",
          data: null
        };
      }
    }
  );
};

const executeOperation = async (
  page: Page | undefined,
  operation: SmallOperation
) => {
  switch (operation.type) {
    case OPERATION_TYPES.OPEN:
      if ("value" in operation.inputs[0]) {
        const url = operation.inputs[0].value;
        await page?.goto(url);
        return true;
      } else {
        return false;
      }
  }
};
