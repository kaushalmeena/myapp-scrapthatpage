import {
  ExecuteResponse,
  ScraperOperation,
  ScraperResult
} from "../../common/types/scraper";
import Scraper from "../lib/Scraper";

// How long click/type wait for their target element before failing.
const AUTO_WAIT_TIMEOUT_MS = 10000;

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
        // Values are JSON-encoded before being embedded in the injected script
        // so selectors/attributes containing quotes can't break out of the
        // string literal or inject arbitrary code.
        const rawData = await scraper.executeJavascript(`
          Array.from(document.querySelectorAll(${JSON.stringify(
            operation.selector
          )})).map((element) => element[${JSON.stringify(operation.attribute)}]);
        `);
        result = {
          ...operation,
          url: scraper.getActiveURL(),
          data: rawData as string[]
        };
      }
      break;
    case "click":
      // Auto-wait so clicks tolerate content that loads after navigation.
      await scraper.waitForSelector(operation.selector, AUTO_WAIT_TIMEOUT_MS);
      await scraper.executeJavascript(`
          document.querySelector(${JSON.stringify(operation.selector)}).click();
        `);
      break;
    case "type":
      await scraper.waitForSelector(operation.selector, AUTO_WAIT_TIMEOUT_MS);
      await scraper.executeJavascript(`
          document.querySelector(${JSON.stringify(
            operation.selector
          )}).value = ${JSON.stringify(operation.text)};
        `);
      break;
    case "wait":
      await scraper.waitForSelector(operation.selector, operation.timeoutMs);
      break;
    case "delay":
      await scraper.delay(operation.ms);
      break;
    case "scroll":
      await scraper.scroll(operation.selector);
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
      message:
        err instanceof Error
          ? err.message
          : "Error occurred in executing operation"
    };
  }
};
