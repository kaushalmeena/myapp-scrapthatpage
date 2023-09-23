export const enum ScraperChannel {
  OPEN_WINDOW = "open_window",
  CLOSE_WINDOW = "close_window",
  GET_VERSION = "get_version",
  LOAD_URL = "load_url",
  RUN_JAVASCRIPT = "run_javascript",
  RUN_OPERATION = "run_operation"
}

type ScraperOpenOperation = {
  type: "open";
  url: string;
};

type ScraperExtractOperation = {
  type: "extract";
  name: string;
  selector: string;
  attribute: string;
};

type ScraperClickOperation = {
  type: "click";
  selector: string;
};

type ScraperTypeOperation = {
  type: "type";
  selector: string;
  text: string;
};

export type ScraperOperation =
  | ScraperOpenOperation
  | ScraperExtractOperation
  | ScraperClickOperation
  | ScraperTypeOperation;

export type ExtractOperationResult = {
  type: "extract";
  url: string;
  name: string;
  selector: string;
  attribute: string;
  data: string[];
};

export type ScraperResult = ExtractOperationResult | null;

type ExecuteError = {
  status: "error";
  message: string;
};

type ExecuteSuccess = {
  status: "success";
  result: ScraperResult;
};

export type ExecuteResponse = ExecuteError | ExecuteSuccess;
