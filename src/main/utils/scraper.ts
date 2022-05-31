import { OperationTypes } from "../../common/constants/operation";
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
    case OperationTypes.OPEN:
      await scraper.loadURL(operation.url);
      break;
    case OperationTypes.EXTRACT:
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
          data: data as string[]
        };
      }
      break;
    case OperationTypes.CLICK:
      await scraper.executeJavascript(`
          document.querySelector("${operation.selector}").click();
        `);
      break;
    case OperationTypes.TYPE:
      await scraper.executeJavascript(`
          document.querySelector("${operation.selector}").value = "${operation.text}";
        `);
      break;
    default:
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
      result
    };
  } catch (err) {
    return {
      status: "error",
      message: "Error occurred in executing operation"
    };
  }
};
