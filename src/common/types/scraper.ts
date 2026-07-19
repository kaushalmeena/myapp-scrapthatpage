export enum ScraperChannel {
  OPEN_WINDOW = "open_window",
  CLOSE_WINDOW = "close_window",
  GET_VERSION = "get_version",
  LOAD_URL = "load_url",
  RUN_JAVASCRIPT = "run_javascript",
  RUN_OPERATION = "run_operation",
  CONFIGURE = "configure",
  PICK_ELEMENT = "pick_element"
}

// Runtime options the renderer can set before starting a run.
export type ScraperConfig = {
  // Whether the scraper window is shown during runs (false = headless).
  showWindow: boolean;
};

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

type ScraperWaitOperation = {
  type: "wait";
  selector: string;
  timeoutMs: number;
};

type ScraperDelayOperation = {
  type: "delay";
  ms: number;
};

type ScraperScrollOperation = {
  type: "scroll";
  // Empty selector scrolls to the bottom of the page.
  selector: string;
};

export type ScraperOperation =
  | ScraperOpenOperation
  | ScraperExtractOperation
  | ScraperClickOperation
  | ScraperTypeOperation
  | ScraperWaitOperation
  | ScraperDelayOperation
  | ScraperScrollOperation;

export type PickElementResponse =
  | { status: "success"; selector: string }
  | { status: "cancelled" }
  | { status: "error"; message: string };

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
