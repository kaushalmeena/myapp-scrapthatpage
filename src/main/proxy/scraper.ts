import { ipcMain } from "electron";
import { Page } from "puppeteer-core";
import { OPERATION_TYPES } from "../../common/constants/operation";
import { SCRAPER_ACTIONS } from "../../common/constants/scraper";
import { ScraperOperation, ScraperResult } from "../../common/types/scraper";
import { SmallOperation } from "../../common/types/smallOperation";
import PuppeteerWrapper from "../lib/PuppeteerWrapper";

export const connectScraperProxy = (puppeteer: PuppeteerWrapper): void => {
  ipcMain.on(SCRAPER_ACTIONS.OPEN_BROWSER, () => {
    puppeteer.openBrowser();
  });

  ipcMain.on(SCRAPER_ACTIONS.OPEN_WINDOW, () => {
    puppeteer.openWindow();
  });

  ipcMain.on(SCRAPER_ACTIONS.OPEN_PAGE, () => {
    puppeteer.openPage();
  });

  ipcMain.on(SCRAPER_ACTIONS.CLOSE_BROWSER, () => {
    puppeteer.closeBrowser();
  });

  ipcMain.on(SCRAPER_ACTIONS.CLOSE_WINDOW, () => {
    puppeteer.closeWindow();
  });

  ipcMain.on(SCRAPER_ACTIONS.CLOSE_PAGE, () => {
    puppeteer.closePage();
  });

  ipcMain.handle(
    SCRAPER_ACTIONS.RUN_OPERATION,
    async (event, operation: ScraperOperation): Promise<ScraperResult> => {
      try {
        const page = await puppeteer.getPage();
        const result = await executeOperation(page, operation);
        if (result) {
          return {
            status: "success",
            data: result
          };
        }
        return {
          status: "success"
        };
      } catch (err) {
        console.log(err);
        return {
          status: "error",
          message: "Error occureed in executing operation"
        };
      }
    }
  );
};

const executeOperation = async (page: Page, operation: ScraperOperation) => {
  let result;
  let url;
  let selector;
  let text;

  switch (operation.type) {
    case OPERATION_TYPES.OPEN:
      url = operation.inputs[0].value;
      await page.goto(url);
    case OPERATION_TYPES.EXTRACT:
      selector = operation.inputs[1].value;
      result = await page.evaluate((selector) => {
        return Array.from(document.querySelectorAll(selector)).map(
          (query) => query.textContent
        );
      }, selector);
    case OPERATION_TYPES.CLICK:
      selector = operation.inputs[1].value;
      await page.click(selector);
    case OPERATION_TYPES.TYPE:
      selector = operation.inputs[0].value;
      text = operation.inputs[1].value;
      await page.type(selector, text);
  }

  return result;
};
