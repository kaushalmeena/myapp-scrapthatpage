import {
  VARIABLE_PICKER_MODES,
  VARIABLE_SETTER_MODES,
  VARIABLE_TYPES
} from "../constants/variable";

export type Variable = {
  name: string;
  type: string;
  path: string;
};

export type VariablePicker = {
  type: VARIABLE_TYPES;
  mode: VARIABLE_PICKER_MODES;
};

export type VariableSetter = {
  mode: VARIABLE_SETTER_MODES;
};

export type VariableMapping = Record<string, string | number>;
