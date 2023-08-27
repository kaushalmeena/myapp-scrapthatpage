import { ScraperAPI } from "./preload/types/scraper";

// This allow TypeScript to pick types for ScraperAPI on window
declare global {
  interface Window {
    scraper: ScraperAPI;
  }
}
