import { contextBridge } from "electron";
import { ScraperProxy } from "./proxy/scraper";
import { ScraperAPI } from "./types/scraper";

declare global {
  interface Window {
    scraper: ScraperAPI;
  }
}

contextBridge.exposeInMainWorld("scraper", ScraperProxy);
