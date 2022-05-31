import { OperationTypes } from "../constants/operation";

type ScraperOpenOperation = {
  type: OperationTypes.OPEN;
  url: string;
};

type ScraperExtractOperation = {
  type: OperationTypes.EXTRACT;
  name: string;
  selector: string;
  attribute: string;
};

type ScraperClickOperation = {
  type: OperationTypes.CLICK;
  selector: string;
};

type ScraperTypeOperation = {
  type: OperationTypes.TYPE;
  selector: string;
  text: string;
};

export type ScraperOperation =
  | ScraperOpenOperation
  | ScraperExtractOperation
  | ScraperClickOperation
  | ScraperTypeOperation;

export type ExtractOperationResult = {
  type: OperationTypes.EXTRACT;
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

export type ExecuteResult = ExecuteError | ExecuteSuccess;
