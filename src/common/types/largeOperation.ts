import { GridSize, InputBaseProps } from "@mui/material";
import { ValidationRule } from "./validation";
import { VariablePicker, VariableSetter } from "./variable";

export type SelectOption = {
  label: string;
  value: string;
};

export type LargeTextInput = {
  label: string;
  type: "text";
  width: GridSize;
  value: string;
  error: string;
  variablePicker?: VariablePicker;
  variableSetter?: VariableSetter;
  inputProps?: InputBaseProps;
  rules: ValidationRule[];
};

export type LargeSelectInput = {
  label: string;
  type: "select";
  width: GridSize;
  options: SelectOption[];
  value: string;
  error: string;
  variableSetter?: VariableSetter;
  rules: ValidationRule[];
};

export type LargeOperationBoxInput = {
  label: string;
  type: "operation_box";
  operations: LargeOperation[];
};

type LargeOpenOperation = {
  name: string;
  description: string;
  format: string;
  type: "open";
  inputs: [LargeTextInput];
};

type LargeExtractOperation = {
  name: string;
  description: string;
  format: string;
  type: "extract";
  inputs: [LargeTextInput, LargeTextInput, LargeSelectInput];
};

type LargeClickOperation = {
  name: string;
  description: string;
  format: string;
  type: "click";
  inputs: [LargeTextInput];
};

type LargeTypeOperation = {
  name: string;
  description: string;
  format: string;
  type: "type";
  inputs: [LargeTextInput, LargeTextInput];
};

type LargeSetOperation = {
  name: string;
  description: string;
  format: string;
  type: "set";
  inputs: [LargeTextInput, LargeSelectInput, LargeTextInput];
};

type LargeIncreaseOperation = {
  name: string;
  description: string;
  format: string;
  type: "increase";
  inputs: [LargeTextInput, LargeTextInput];
};

type LargeDecreaseOperation = {
  name: string;
  description: string;
  format: string;
  type: "decrease";
  inputs: [LargeTextInput, LargeTextInput];
};

type LargeIfOperation = {
  name: string;
  description: string;
  format: string;
  type: "if";
  inputs: [LargeTextInput, LargeOperationBoxInput];
};

type LargeWhileOperation = {
  name: string;
  description: string;
  format: string;
  type: "while";
  inputs: [LargeTextInput, LargeOperationBoxInput];
};

export type LargeInput =
  | LargeTextInput
  | LargeSelectInput
  | LargeOperationBoxInput;

export type LargeOperation =
  | LargeOpenOperation
  | LargeExtractOperation
  | LargeClickOperation
  | LargeTypeOperation
  | LargeSetOperation
  | LargeIncreaseOperation
  | LargeDecreaseOperation
  | LargeIfOperation
  | LargeWhileOperation;
