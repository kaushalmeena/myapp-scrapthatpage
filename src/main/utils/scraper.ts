import { Page } from "puppeteer-core";
import { OPERATION_TYPES } from "../../common/constants/operation";
import { ScraperResult, ScraperOperation } from "../../common/types/scraper";

export const executeOperation = async (
  page: Page,
  operation: ScraperOperation
): Promise<ScraperResult> => {
  let result = null;

  switch (operation.type) {
    case OPERATION_TYPES.OPEN:
      {
        await page.goto(operation.url);
      }
      break;
    case OPERATION_TYPES.EXTRACT:
      {
        const data = await page.evaluate((selector) => {
          return Array.from(document.querySelectorAll(selector)).map(
            (query) => query.textContent
          );
        }, operation.selector);
        result = {
          type: operation.type,
          url: page.url(),
          name: operation.name,
          selector: operation.selector,
          result: data
        };
      }
      break;
    case OPERATION_TYPES.CLICK:
      {
        await page.click(operation.selector);
      }
      break;
    case OPERATION_TYPES.TYPE:
      {
        await page.type(operation.selector, operation.text);
      }
      break;
  }

  return result;
};
