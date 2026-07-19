import {
  type PickElementResponse,
  ScraperChannel,
  type ScraperConfig,
  type ScraperOperation
} from "@common/types/scraper";
import { app, ipcMain } from "electron";
import type Scraper from "../lib/Scraper";
import { PickCancelledError } from "../lib/Scraper/DebuggerPage";
import { executeOperation } from "../utils/scraper";

const SCRAPER_OPERATION_TYPES = [
  "open",
  "extract",
  "click",
  "type",
  "wait",
  "delay",
  "scroll"
];

// The renderer is treated as untrusted, so every IPC argument is validated
// before it reaches the scraper.
const isHttpUrl = (value: unknown): value is string =>
  typeof value === "string" && /^https?:\/\//i.test(value);

const isScraperOperation = (value: unknown): value is ScraperOperation =>
  typeof value === "object" &&
  value !== null &&
  "type" in value &&
  SCRAPER_OPERATION_TYPES.includes((value as { type: string }).type);

export const connectScraperProxy = (scraper: Scraper) => {
  ipcMain.on(ScraperChannel.OPEN_WINDOW, () => {
    scraper.openWindow();
  });
  ipcMain.on(ScraperChannel.CLOSE_WINDOW, () => {
    scraper.closeWindow();
  });
  ipcMain.handle(ScraperChannel.GET_VERSION, () => app.getVersion());
  ipcMain.handle(ScraperChannel.LOAD_URL, (_, url: unknown) => {
    if (!isHttpUrl(url)) {
      throw new Error("loadURL expects an http(s) URL string");
    }
    return scraper.loadURL(url);
  });
  ipcMain.handle(ScraperChannel.RUN_JAVASCRIPT, (_, code: unknown) => {
    if (typeof code !== "string") {
      throw new Error("runJavascript expects a code string");
    }
    return scraper.executeJavascript(code);
  });
  ipcMain.handle(ScraperChannel.RUN_OPERATION, (_, operation: unknown) => {
    if (!isScraperOperation(operation)) {
      throw new Error("runOperation expects a valid scraper operation");
    }
    return executeOperation(operation, scraper);
  });
  ipcMain.on(ScraperChannel.CONFIGURE, (_, config: unknown) => {
    if (
      typeof config === "object" &&
      config !== null &&
      typeof (config as ScraperConfig).showWindow === "boolean"
    ) {
      scraper.configure({
        showWindow: (config as ScraperConfig).showWindow
      });
    }
  });
  ipcMain.handle(
    ScraperChannel.PICK_ELEMENT,
    async (): Promise<PickElementResponse> => {
      try {
        const selector = await scraper.pickElement();
        return { status: "success", selector };
      } catch (err) {
        if (err instanceof PickCancelledError) {
          return { status: "cancelled" };
        }
        return {
          status: "error",
          message:
            err instanceof Error ? err.message : "Element picking failed."
        };
      }
    }
  );
};

export const disconnectScraperProxy = () => {
  ipcMain.removeAllListeners(ScraperChannel.OPEN_WINDOW);
  ipcMain.removeAllListeners(ScraperChannel.CLOSE_WINDOW);
  ipcMain.removeAllListeners(ScraperChannel.CONFIGURE);
  ipcMain.removeHandler(ScraperChannel.GET_VERSION);
  ipcMain.removeHandler(ScraperChannel.LOAD_URL);
  ipcMain.removeHandler(ScraperChannel.RUN_JAVASCRIPT);
  ipcMain.removeHandler(ScraperChannel.RUN_OPERATION);
  ipcMain.removeHandler(ScraperChannel.PICK_ELEMENT);
};
