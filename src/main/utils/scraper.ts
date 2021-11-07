import { Page } from "puppeteer-core";
import { OPERATION_TYPES } from "../../common/constants/operation";
import { ExecuteResult, ScraperOperation } from "../../common/types/scraper";

export const executeOperation = async (
  page: Page,
  operation: ScraperOperation
): Promise<ExecuteResult> => {
  let result = null;

  switch (operation.type) {
    case OPERATION_TYPES.OPEN:
      {
        const url = operation.inputs[0].value;
        await page.goto(url);
      }
      break;
    case OPERATION_TYPES.EXTRACT:
      {
        const name = operation.inputs[0].value;
        const selector = operation.inputs[1].value;
        const data = await page.evaluate((selector) => {
          return Array.from(document.querySelectorAll(selector)).map(
            (query) => query.textContent
          );
        }, selector);
        result = {
          url: page.url(),
          name,
          selector,
          data: data
        };
      }
      break;
    case OPERATION_TYPES.CLICK:
      {
        const selector = operation.inputs[1].value;
        await page.click(selector);
      }
      break;
    case OPERATION_TYPES.TYPE:
      {
        const selector = operation.inputs[0].value;
        const text = operation.inputs[1].value;
        await page.type(selector, text);
      }
      break;
  }

  return result;
};
