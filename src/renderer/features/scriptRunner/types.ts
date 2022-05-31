import { ScraperOperation } from "../../../common/types/scraper";

// ScriptRunner hook types
export type RunnerStatus =
  | "READY"
  | "STARTED"
  | "STOPPED"
  | "FINISHED"
  | "ERROR";

export type RunnerExecution = "started" | "stopped";

export type RunnerGenerator = Generator<
  ScraperOperation,
  void,
  ScraperOperation
> | null;

export type ScriptRunnerHook = {
  status: RunnerStatus;
  heading: string;
  message: string;
  tableData: TableData;
  start: () => void;
  stop: () => void;
};

// ScriptRunner utils types
export type HeadingAndMessage = {
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

export type IconAndColor = {
  icon: string;
  color: ActionButtonColor;
};

export type TableRow = {
  [key: string]: string;
};

export type TableData = TableRow[];
