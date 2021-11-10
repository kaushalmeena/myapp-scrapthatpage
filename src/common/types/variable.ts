export type Variable = {
  name: string;
  type: string;
};

export type VariableType = "number" | "string";

export type VariableUpdateMode = "SET" | "APPEND";

export type VariableFilterType = VariableType | "*";

export type VariablePicker = {
  type: VariableFilterType;
  mode: VariableUpdateMode;
};

export type VariableMapping = Record<string, string | number>;
