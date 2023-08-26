export type ActionButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning";

export type TableRow = {
  [key: string]: string;
};

export type TableData = TableRow[];
