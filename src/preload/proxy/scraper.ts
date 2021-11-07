import { ipcRenderer } from "electron";
import { SCRAPER_ACTIONS } from "../../common/constants/scraper";
import { SmallOperation } from "../../common/types/smallOperation";
import { ScraperAPI } from "../types/scraper";

export const ScraperProxy: ScraperAPI = {
  runOperation: (operation: SmallOperation) =>
    ipcRenderer.invoke(SCRAPER_ACTIONS.RUN_OPERATION, operation)
};
