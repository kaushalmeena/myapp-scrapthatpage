import type { ValidationRule } from "./validation";
import type { VariablePicker, VariableSetter } from "./variable";

// Number of columns (out of a 12-column grid) an input occupies in the editor.
export type InputWidth = 4 | 6 | 12;

// Plain HTML input attributes an operation can preset on its text input.
export type InputAttributes = {
  readOnly?: boolean;
  placeholder?: string;
  type?: "text" | "number";
};

/**
 * "Form" operations are the editor-facing form of a script action. On top of
 * the raw value they carry everything the editor UI needs: labels, layout
 * width, validation rules/errors, a display format string, and variable
 * picker/setter config. They are converted to the compact "Data" form (see
 * dataOperation.ts) for storage and execution in common/utils/operation.ts.
 */

export type SelectOption = {
  label: string;
  value: string;
};

export type FormTextInput = {
  label: string;
  type: "text";
  width: InputWidth;
  value: string;
  error: string;
  variablePicker?: VariablePicker;
  variableSetter?: VariableSetter;
  // When true the editor offers a crosshair button that lets the user click
  // an element in the scraper window to fill this input with its selector.
  elementPicker?: boolean;
  inputProps?: InputAttributes;
  rules: ValidationRule[];
};

export type FormSelectInput = {
  label: string;
  type: "select";
  width: InputWidth;
  options: SelectOption[];
  value: string;
  error: string;
  variableSetter?: VariableSetter;
  rules: ValidationRule[];
};

export type FormBlockInput = {
  label: string;
  type: "block";
  steps: FormOperation[];
};

type FormOpenOperation = {
  name: string;
  description: string;
  format: string;
  type: "open";
  inputs: [FormTextInput];
};

type FormExtractOperation = {
  name: string;
  description: string;
  format: string;
  type: "extract";
  inputs: [FormTextInput, FormTextInput, FormSelectInput];
};

type FormClickOperation = {
  name: string;
  description: string;
  format: string;
  type: "click";
  inputs: [FormTextInput];
};

type FormTypeOperation = {
  name: string;
  description: string;
  format: string;
  type: "type";
  inputs: [FormTextInput, FormTextInput];
};

type FormSetOperation = {
  name: string;
  description: string;
  format: string;
  type: "set";
  inputs: [FormTextInput, FormSelectInput, FormTextInput];
};

type FormIncreaseOperation = {
  name: string;
  description: string;
  format: string;
  type: "increase";
  inputs: [FormTextInput, FormTextInput];
};

type FormDecreaseOperation = {
  name: string;
  description: string;
  format: string;
  type: "decrease";
  inputs: [FormTextInput, FormTextInput];
};

type FormIfOperation = {
  name: string;
  description: string;
  format: string;
  type: "if";
  inputs: [FormTextInput, FormBlockInput];
};

type FormWhileOperation = {
  name: string;
  description: string;
  format: string;
  type: "while";
  inputs: [FormTextInput, FormBlockInput];
};

type FormWaitOperation = {
  name: string;
  description: string;
  format: string;
  type: "wait";
  inputs: [FormTextInput, FormTextInput];
};

type FormDelayOperation = {
  name: string;
  description: string;
  format: string;
  type: "delay";
  inputs: [FormTextInput];
};

type FormScrollOperation = {
  name: string;
  description: string;
  format: string;
  type: "scroll";
  inputs: [FormTextInput];
};

export type FormInput = FormTextInput | FormSelectInput | FormBlockInput;

export type FormOperation =
  | FormOpenOperation
  | FormExtractOperation
  | FormClickOperation
  | FormTypeOperation
  | FormSetOperation
  | FormIncreaseOperation
  | FormDecreaseOperation
  | FormIfOperation
  | FormWhileOperation
  | FormWaitOperation
  | FormDelayOperation
  | FormScrollOperation;
