export type Variable = {
  name: string;
  type: string;
  // Id of the editor operation (a "set") that owns this variable.
  ownerId: string;
};

export type VariableType = "number" | "string" | "any";

export type VariablePickerMode = "set" | "append";

export type VariablePicker = {
  type: VariableType;
  mode: VariablePickerMode;
};

export type VariableSetterMode = "type" | "name";

export type VariableSetter = {
  mode: VariableSetterMode;
};

export type VariableMapping = Record<string, string | number>;
