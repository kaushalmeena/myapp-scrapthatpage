import type { ValidationRule } from "./validation";
import type { VariablePicker, VariableSetter } from "./variable";

/**
 * Static, per-type description of an operation: everything the editor needs to
 * render and validate a step that is NOT part of the stored data. The stored
 * value(s) live in the Operation (see operation.ts); this schema is looked up by
 * `operation.type` at render/validate time, so each editor instance stays as
 * thin as the data itself.
 */

// Number of columns (out of a 12-column grid) an input occupies in the editor.
export type InputWidth = 4 | 6 | 12;

// Plain HTML input attributes an operation can preset on its text input.
export type InputAttributes = {
  readOnly?: boolean;
  placeholder?: string;
  type?: "text" | "number";
};

export type SelectOption = {
  label: string;
  value: string;
};

export type TextInputSchema = {
  type: "text";
  label: string;
  width: InputWidth;
  // Value a freshly added step starts with.
  defaultValue: string;
  rules: ValidationRule[];
  variablePicker?: VariablePicker;
  variableSetter?: VariableSetter;
  // When true the editor offers a crosshair button that lets the user click
  // an element in the scraper window to fill this input with its selector.
  elementPicker?: boolean;
  inputProps?: InputAttributes;
};

export type SelectInputSchema = {
  type: "select";
  label: string;
  width: InputWidth;
  defaultValue: string;
  options: SelectOption[];
  rules: ValidationRule[];
  variableSetter?: VariableSetter;
};

export type BlockInputSchema = {
  type: "block";
  label: string;
};

export type InputSchema =
  | TextInputSchema
  | SelectInputSchema
  | BlockInputSchema;

export type OperationSchema = {
  name: string;
  description: string;
  // Display-format string with single-brace `{index}` tokens (see
  // common/utils/operation.ts). Distinct from runtime `{{name}}` variables.
  format: string;
  inputs: InputSchema[];
};
