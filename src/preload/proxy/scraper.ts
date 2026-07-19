import { ipcRenderer } from "electron";
import {
  ScraperChannel,
  type ScraperConfig,
  type ScraperOperation
} from "../../common/types/scraper";
import type { ScraperAPI } from "../types/scraper";

export const ScraperProxy: ScraperAPI = {
  openWindow: () => ipcRenderer.send(ScraperChannel.OPEN_WINDOW),
  closeWindow: () => ipcRenderer.send(ScraperChannel.CLOSE_WINDOW),
  configure: (config: ScraperConfig) =>
    ipcRenderer.send(ScraperChannel.CONFIGURE, config),
  getVersion: () => ipcRenderer.invoke(ScraperChannel.GET_VERSION),
  loadURL: (url: string) => ipcRenderer.invoke(ScraperChannel.LOAD_URL, url),
  runOperation: (operation: ScraperOperation) =>
    ipcRenderer.invoke(ScraperChannel.RUN_OPERATION, operation),
  runJavascript: (code: string) =>
    ipcRenderer.invoke(ScraperChannel.RUN_JAVASCRIPT, code),
  pickElement: () => ipcRenderer.invoke(ScraperChannel.PICK_ELEMENT)
};
