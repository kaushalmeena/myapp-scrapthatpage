import { ExecuteResult, ScraperOperation } from "../../common/types/scraper";

export type ScraperAPI = {
  openWindow: () => void;
  closeWindow: () => void;
  loadURL: (url: string) => Promise<void>;
  runJavascript: (code: string) => Promise<unknown>;
  runOperation: (operation: ScraperOperation) => Promise<ExecuteResult>;
};
