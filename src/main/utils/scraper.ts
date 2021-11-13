import { OPERATION_TYPES } from "../../common/constants/operation";
import {
  ExecuteResult,
  ScraperOperation,
  ScraperResult
} from "../../common/types/scraper";
import Scraper from "../lib/Scraper";

const executeOperation = async (
  scraper: Scraper,
  operation: ScraperOperation
): Promise<ScraperResult> => {
  let result = null;

  switch (operation.type) {
    case OPERATION_TYPES.OPEN:
      {
        await scraper.loadURL(operation.url);
      }
      break;
    case OPERATION_TYPES.EXTRACT:
      {
        const data = await scraper.executeJavascript(`
          Array.from(document.querySelectorAll("${operation.selector}")).map(
            (query) => query["${operation.attribute}"]
          );
        `);
        result = {
          type: operation.type,
          url: scraper.getActiveURL(),
          name: operation.name,
          selector: operation.selector,
          attribute: operation.attribute,
          result: data as string[]
        };
      }
      break;
    case OPERATION_TYPES.CLICK:
      {
        await scraper.executeJavascript(`
          document.querySelector("${operation.selector}").click();
        `);
      }
      break;
    case OPERATION_TYPES.TYPE:
      {
        await scraper.executeJavascript(`
          document.querySelector("${operation.selector}").value = "${operation.text}";
        `);
      }
      break;
  }

  return result;
};

export const handleExecuteOperation = async (
  scraper: Scraper,
  operation: ScraperOperation
): Promise<ExecuteResult> => {
  try {
    const result = await executeOperation(scraper, operation);
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
};
