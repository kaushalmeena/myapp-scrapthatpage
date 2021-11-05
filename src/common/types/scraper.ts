import { OPERATION_TYPES } from "../constants/operation";
import { SmallTextInput } from "./smallOperation";

type OperationError = {
  status: "error";
  message: string;
};

type OperationSuccess = {
  status: "success";
};

type OperationSuccessWithData = {
  status: "success";
  data: string[];
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
