export type ScriptRunnerStatus = "started" | "stopped";

export type ActionButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning";

export type OperationNameAndSubheader = {
  name: string;
  subheader: string;
};

export type TableRow = {
  [key: string]: string;
};

export type TableData = TableRow[];
