import { contextBridge, ipcRenderer } from "electron";
import { ScraperProxy } from "./api/scraper";
import { ScraperAPI } from "./types/scraper";

declare global {
  interface Window {
    scraper: ScraperAPI;
  }
}

contextBridge.exposeInMainWorld("scraper", ScraperProxy);
