import { OPERATION_TYPES } from "../constants/operation";
import { SmallTextInput } from "./smallOperation";

type OperationError = {
  status: "error";
  message: string;
};

type OperationSuccess = {
  status: "success";
};

export type ExtractOperationResult = {
  url: string;
  name: string;
  selector: string;
  data: string[];
};

type OperationSuccessWithData = {
  status: "success";
  data: ExtractOperationResult;
};

type ScraperInput = SmallTextInput;

export type ScraperResult =
  | OperationError
  | OperationSuccess
  | OperationSuccessWithData;

export type ScraperOperation = {
  type: OPERATION_TYPES;
  inputs: ScraperInput[];
};

export type ExecuteResult = ExtractOperationResult | undefined;
