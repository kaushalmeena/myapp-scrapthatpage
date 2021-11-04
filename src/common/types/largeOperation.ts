import { INPUT_TYPES } from "../constants/input";
import { OPERATION_TYPES } from "../constants/operation";
import { ValidationRule } from "./validation";

type LargeTextInput = {
  label: string;
  type: INPUT_TYPES.TEXT;
  width: number;
  value: string;
  error: string;
  rules: ValidationRule[];
};

type LargeTextAreaInput = {
  label: string;
  type: INPUT_TYPES.TEXTAREA;
  width: number;
  value: string;
  error: string;
  rules: ValidationRule[];
};

type LargeOperationBoxInput = {
  label: string;
  type: INPUT_TYPES.OPERATION_BOX;
  width: number;
  operations: LargeOperation[];
};

export type LargeInput =
  | LargeTextInput
  | LargeTextAreaInput
  | LargeOperationBoxInput;

export interface LargeOperation {
  name: string;
  type: OPERATION_TYPES;
  description: string;
  format: string;
  inputs: LargeInput[];
}
