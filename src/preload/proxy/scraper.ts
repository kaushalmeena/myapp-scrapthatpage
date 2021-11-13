import { ipcRenderer } from "electron";
import { SCRAPER_CHANNELS } from "../../common/constants/scraper";
import { ScraperOperation } from "../../common/types/scraper";
import { ScraperAPI } from "../types/scraper";

export const ScraperProxy: ScraperAPI = {
  openWindow: () => ipcRenderer.send(SCRAPER_CHANNELS.OPEN_WINDOW),
  closeWindow: () => ipcRenderer.send(SCRAPER_CHANNELS.CLOSE_WINDOW),
  runOperation: (operation: ScraperOperation) =>
    ipcRenderer.invoke(SCRAPER_CHANNELS.RUN_OPERATION, operation)
};
