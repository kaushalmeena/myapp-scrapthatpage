export type ActionButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning";

export type ActionButtonData = { icon: string; color: ActionButtonColor };

export type TableData = {
  headers: string[];
  rows: string[][];
};
