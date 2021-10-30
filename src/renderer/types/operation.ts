import { INPUT_TYPES, OPERATION_TYPES } from "../constants/operations";
import { ValidationRule } from "./validation";

type TextInput = {
  label: string;
  type: INPUT_TYPES.TEXT;
  width: number;
  value: string;
  error: string;
  rules: ValidationRule[];
};

type TextAreaInput = {
  label: string;
  type: INPUT_TYPES.TEXTAREA;
  width: number;
  value: string;
  error: string;
  rules: ValidationRule[];
};

type OperationBoxInput = {
  label: string;
  type: INPUT_TYPES.OPERATION_BOX;
  width: number;
  operations: Operation[];
};

export type Input = TextInput | TextAreaInput | OperationBoxInput;

export interface Operation {
  name: string;
  type: OPERATION_TYPES;
  description: string;
  format: string;
  inputs: Input[];
}
