import { ipcRenderer } from "electron";
import { ScraperAPI } from "../types/scraper";
import { ScraperChannel, ScraperOperation } from "../../common/types/scraper";

export const ScraperProxy: ScraperAPI = {
  openWindow: () => ipcRenderer.send(ScraperChannel.OPEN_WINDOW),
  closeWindow: () => ipcRenderer.send(ScraperChannel.CLOSE_WINDOW),
  getVersion: () => ipcRenderer.invoke(ScraperChannel.GET_VERSION),
  loadURL: (url: string) => ipcRenderer.invoke(ScraperChannel.LOAD_URL, url),
  runOperation: (operation: ScraperOperation) =>
    ipcRenderer.invoke(ScraperChannel.RUN_OPERATION, operation),
  runJavascript: (code: string) =>
    ipcRenderer.invoke(ScraperChannel.RUN_JAVASCRIPT, code)
};
