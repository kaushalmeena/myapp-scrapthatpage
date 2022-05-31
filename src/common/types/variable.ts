import {
  VariablePickerModes,
  VariableSetterModes,
  VariableTypes
} from "../constants/variable";

export type Variable = {
  name: string;
  type: string;
  path: string;
};

export type VariablePicker = {
  type: VariableTypes;
  mode: VariablePickerModes;
};

export type VariableSetter = {
  mode: VariableSetterModes;
};

export type VariableMapping = Record<string, string | number>;
