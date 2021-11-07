import { OPERATION_TYPES } from "../constants/operation";
import { SmallTextInput } from "./smallOperation";

export type ExtractOperationResult = {
  url: string;
  name: string;
  selector: string;
  data: string[];
};

type OperationError = {
  status: "error";
  message: string;
};

type OperationSuccess = {
  status: "success";
  data: ExecuteResult;
};

type ScraperInput = SmallTextInput;

export type ScraperResult = OperationError | OperationSuccess;

export type ScraperOperation = {
  type: OPERATION_TYPES;
  inputs: ScraperInput[];
};

export type ExecuteResult = ExtractOperationResult | null;
