import type {
  ExecuteResponse,
  ScraperOperation,
  ScraperResult
} from "@common/types/scraper";
import type Scraper from "../lib/Scraper";

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
      result = {
        ...operation,
        url: scraper.getActiveURL(),
        data: await scraper.extract(operation.selector, operation.attribute)
      };
      break;
    case "click":
      await scraper.click(operation.selector);
      break;
    case "type":
      await scraper.type(operation.selector, operation.text);
      break;
    case "wait":
      await scraper.waitFor(operation.selector, operation.timeoutMs);
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
