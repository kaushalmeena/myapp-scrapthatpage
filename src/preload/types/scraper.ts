import {
  ExecuteResponse,
  PickElementResponse,
  ScraperConfig,
  ScraperOperation
} from "../../common/types/scraper";

export type ScraperAPI = {
  openWindow: () => void;
  closeWindow: () => void;
  configure: (config: ScraperConfig) => void;
  getVersion: () => Promise<string>;
  loadURL: (url: string) => Promise<void>;
  runJavascript: (code: string) => Promise<unknown>;
  runOperation: (operation: ScraperOperation) => Promise<ExecuteResponse>;
  pickElement: () => Promise<PickElementResponse>;
};

// This allow TypeScript to pick types for ScraperAPI on window
declare global {
  interface Window {
    scraper: ScraperAPI;
  }
}
