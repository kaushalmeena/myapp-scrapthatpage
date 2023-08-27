import { contextBridge } from "electron";
import { ScraperProxy } from "./proxy/scraper";

contextBridge.exposeInMainWorld("scraper", ScraperProxy);
