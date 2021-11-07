import { ScraperResult } from "../../common/types/scraper";
import { SmallOperation } from "../../common/types/smallOperation";

export type ScraperAPI = {
  runOperation: (operation: SmallOperation) => Promise<ScraperResult>;
};
