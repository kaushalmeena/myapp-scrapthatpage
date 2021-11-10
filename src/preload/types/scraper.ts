import { ExecuteResult, ScraperOperation } from "../../common/types/scraper";

export type ScraperAPI = {
  runOperation: (operation: ScraperOperation) => Promise<ExecuteResult>;
};
