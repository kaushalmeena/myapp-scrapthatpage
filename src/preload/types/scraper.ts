import { ScraperResult } from "../../common/types/scraper";
import { SmallOperation } from "../../common/types/smallOperation";

export type ScraperAPI = {
  openBrowser: () => void;
  openWindow: () => void;
  closeBrowser: () => void;
  closeWindow: () => void;
  openPage: () => void;
  runOperation: (operation: SmallOperation) => Promise<ScraperResult>;
};
