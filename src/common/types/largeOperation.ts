import { ValidationRule } from "./validation";
import { VariablePicker, VariableSetter } from "./variable";

// Number of columns (out of a 12-column grid) an input occupies in the editor.
export type InputWidth = 4 | 6 | 12;

// Plain HTML input attributes an operation can preset on its text input.
export type InputAttributes = {
  readOnly?: boolean;
  placeholder?: string;
  type?: "text" | "number";
};

// "Large" operations are the editor-facing form of a script action. On top of
// the raw value they carry everything the editor UI needs: labels, layout width,
// validation rules/errors, a display format string, and variable picker/setter
// config. They are converted to the compact "Small" form (see smallOperation.ts)
// for storage and execution in common/utils/operation.ts.

export type SelectOption = {
  label: string;
  value: string;
};

export type LargeTextInput = {
  label: string;
  type: "text";
  width: InputWidth;
  value: string;
  error: string;
  variablePicker?: VariablePicker;
  variableSetter?: VariableSetter;
  inputProps?: InputAttributes;
  rules: ValidationRule[];
};

export type LargeSelectInput = {
  label: string;
  type: "select";
  width: InputWidth;
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
  LargeTextInput | LargeSelectInput | LargeOperationBoxInput;

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
