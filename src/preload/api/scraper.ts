import { ipcRenderer } from "electron";
import { SCRAPER_ACTIONS } from "../../common/constants/scraper";
import { SmallOperation } from "../../common/types/smallOperation";
import { ScraperAPI } from "../types/scraper";

export const ScraperProxy: ScraperAPI = {
  openBrowser: () => ipcRenderer.send(SCRAPER_ACTIONS.OPEN_BROWSER),
  openWindow: () => ipcRenderer.send(SCRAPER_ACTIONS.OPEN_WINDOW),
  closeBrowser: () => ipcRenderer.send(SCRAPER_ACTIONS.CLOSE_BROWSER),
  closeWindow: () => ipcRenderer.send(SCRAPER_ACTIONS.CLOSE_WINDOW),
  openPage: () => ipcRenderer.send(SCRAPER_ACTIONS.OPEN_PAGE),
  runOperation: (operation: SmallOperation) =>
    ipcRenderer.invoke(SCRAPER_ACTIONS.RUN_OPERATION, operation)
};
