import { OPERATION_TYPES } from "../constants/operation";

type ScraperOpenOperation = {
  type: OPERATION_TYPES.OPEN;
  url: string;
};

type ScraperExtractOperation = {
  type: OPERATION_TYPES.EXTRACT;
  name: string;
  selector: string;
  attribute: string;
};

type ScraperClickOperation = {
  type: OPERATION_TYPES.CLICK;
  selector: string;
};

type ScraperTypeOperation = {
  type: OPERATION_TYPES.TYPE;
  selector: string;
  text: string;
};

export type ScraperOperation =
  | ScraperOpenOperation
  | ScraperExtractOperation
  | ScraperClickOperation
  | ScraperTypeOperation;

export type ExtractOperationResult = {
  type: OPERATION_TYPES.EXTRACT;
  url: string;
  name: string;
  selector: string;
  attribute: string;
  result: string[];
};

export type ScraperResult = ExtractOperationResult | null;

type ExecuteError = {
  status: "error";
  message: string;
};

type ExecuteSuccess = {
  status: "success";
  data: ScraperResult;
};

export type ExecuteResult = ExecuteError | ExecuteSuccess;
