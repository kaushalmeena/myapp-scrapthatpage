import {
  ExecuteResponse,
  ScraperOperation,
  ScraperResult
} from "../../common/types/scraper";
import Scraper from "../lib/Scraper";

const processOperation = async (
  operation: ScraperOperation,
  scraper: Scraper
): Promise<ScraperResult> => {
  let result = null;

  switch (operation.type) {
    case "open":
      await scraper.loadURL(operation.url);
      break;
    case "extract":
      {
        const rawData = await scraper.executeJavascript(`
          Array.from(document.querySelectorAll("${operation.selector}")).map(
            (query) => query["${operation.attribute}"]
          );
        `);
        result = {
          ...operation,
          url: scraper.getActiveURL(),
          data: rawData as string[]
        };
      }
      break;
    case "click":
      await scraper.executeJavascript(`
          document.querySelector("${operation.selector}").click();
        `);
      break;
    case "type":
      await scraper.executeJavascript(`
          document.querySelector("${operation.selector}").value = "${operation.text}";
        `);
      break;
  }

  return result;
};

export const executeOperation = async (
  operation: ScraperOperation,
  scraper: Scraper
): Promise<ExecuteResponse> => {
  try {
    const result = await processOperation(operation, scraper);
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
