import { ExecuteResult, ScraperOperation } from "../../common/types/scraper";

export type ScraperAPI = {
  openWindow: () => void;
  closeWindow: () => void;
  runOperation: (operation: ScraperOperation) => Promise<ExecuteResult>;
};
