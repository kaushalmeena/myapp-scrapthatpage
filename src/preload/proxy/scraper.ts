import { ipcRenderer } from "electron";
import { SCRAPER_CHANNELS } from "../../common/constants/scraper";
import { ScraperOperation } from "../../common/types/scraper";
import { ScraperAPI } from "../types/scraper";

export const ScraperProxy: ScraperAPI = {
  version: process.env.npm_package_version || "",
  openWindow: () => ipcRenderer.send(SCRAPER_CHANNELS.OPEN_WINDOW),
  closeWindow: () => ipcRenderer.send(SCRAPER_CHANNELS.CLOSE_WINDOW),
  loadURL: (url: string) => ipcRenderer.invoke(SCRAPER_CHANNELS.LOAD_URL, url),
  runOperation: (operation: ScraperOperation) =>
    ipcRenderer.invoke(SCRAPER_CHANNELS.RUN_OPERATION, operation),
  runJavascript: (code: string) =>
    ipcRenderer.invoke(SCRAPER_CHANNELS.RUN_JAVASCRIPT, code)
};
