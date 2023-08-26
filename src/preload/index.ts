import { contextBridge } from "electron";
import { ScraperProxy } from "./proxy/scraper";
import { ScraperAPI } from "./types/scraper";

// This allow TypeScript to pick types for ScraperAPI on window
declare global {
  interface Window {
    scraper: ScraperAPI;
  }
}

contextBridge.exposeInMainWorld("scraper", ScraperProxy);
