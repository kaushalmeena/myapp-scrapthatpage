import { ipcRenderer } from "electron";
import { SCRAPER_ACTIONS } from "../../common/constants/scraper";
import { ScraperOperation } from "../../common/types/scraper";
import { ScraperAPI } from "../types/scraper";

export const ScraperProxy: ScraperAPI = {
  runOperation: (operation: ScraperOperation) =>
    ipcRenderer.invoke(SCRAPER_ACTIONS.RUN_OPERATION, operation)
};
