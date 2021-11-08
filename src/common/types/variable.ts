export type VariableType = "number" | "string";

export type Variable = {
  name: string;
  type: string;
};

export type VariableUpdateMode = "SET" | "APPEND";

export type VariableFilterType = VariableType | "*";

export type VariablePicker = {
  type: VariableFilterType;
  mode: VariableUpdateMode;
};
