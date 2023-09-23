import { ScraperOperation } from "../../../common/types/scraper";

export type RunnerGenerator = Generator<
  ScraperOperation,
  void,
  ScraperOperation
> | null;

export type RunnerStatus =
  | "ready"
  | "started"
  | "stopped"
  | "finished"
  | "error";

export type ActionButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning";

export type ActionButtonData = { icon: string; color: ActionButtonColor };

export type TableData = {
  cols: string[];
  rows: string[][];
};
