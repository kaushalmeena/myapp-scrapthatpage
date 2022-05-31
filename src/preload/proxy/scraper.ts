import { ipcRenderer } from "electron";
import { ScraperChannels } from "../../common/constants/scraper";
import { ScraperOperation } from "../../common/types/scraper";
import { ScraperAPI } from "../types/scraper";

export const ScraperProxy: ScraperAPI = {
  version: "1.0.0",
  openWindow: () => ipcRenderer.send(ScraperChannels.OPEN_WINDOW),
  closeWindow: () => ipcRenderer.send(ScraperChannels.CLOSE_WINDOW),
  loadURL: (url: string) => ipcRenderer.invoke(ScraperChannels.LOAD_URL, url),
  runOperation: (operation: ScraperOperation) =>
    ipcRenderer.invoke(ScraperChannels.RUN_OPERATION, operation),
  runJavascript: (code: string) =>
    ipcRenderer.invoke(ScraperChannels.RUN_JAVASCRIPT, code)
};
