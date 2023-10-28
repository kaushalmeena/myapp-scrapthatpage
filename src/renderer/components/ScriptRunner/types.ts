import { ScraperOperation } from "../../../common/types/scraper";

export type RunnerGenerator = Generator<
  ScraperOperation,
  void,
  ScraperOperation
>;

export type RunnerStatus =
  | "ready"
  | "started"
  | "stopped"
  | "finished"
  | "error";

export type RunnerHeaderInfo = {
  heading: string;
  message: string;
};

export type ActionButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning";

export type RunnerCardInfo = {
  title: string;
  icon: string;
  color: ActionButtonColor;
  backgroundColor?: string;
};

export type TableData = {
  cols: string[];
  rows: string[][];
};
