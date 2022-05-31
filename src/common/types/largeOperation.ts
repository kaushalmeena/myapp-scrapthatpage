import { GridSize, InputBaseProps } from "@mui/material";
import { InputTypes } from "../constants/input";
import { OperationTypes } from "../constants/operation";
import { ValidationRule } from "./validation";
import { VariablePicker, VariableSetter } from "./variable";

export type SelectOption = {
  label: string;
  value: string;
};

export type LargeTextInput = {
  label: string;
  type: InputTypes.TEXT;
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
  type: InputTypes.SELECT;
  width: GridSize;
  options: SelectOption[];
  value: string;
  error: string;
  variableSetter?: VariableSetter;
  rules: ValidationRule[];
};

export type LargeOperationBoxInput = {
  label: string;
  type: InputTypes.OPERATION_BOX;
  operations: LargeOperation[];
};

type LargeOpenOperation = {
  name: string;
  description: string;
  format: string;
  type: OperationTypes.OPEN;
  inputs: [LargeTextInput];
};

type LargeExtractOperation = {
  name: string;
  description: string;
  format: string;
  type: OperationTypes.EXTRACT;
  inputs: [LargeTextInput, LargeTextInput, LargeSelectInput];
};

type LargeClickOperation = {
  name: string;
  description: string;
  format: string;
  type: OperationTypes.CLICK;
  inputs: [LargeTextInput];
};

type LargeTypeOperation = {
  name: string;
  description: string;
  format: string;
  type: OperationTypes.TYPE;
  inputs: [LargeTextInput, LargeTextInput];
};

type LargeSetOperation = {
  name: string;
  description: string;
  format: string;
  type: OperationTypes.SET;
  inputs: [LargeTextInput, LargeSelectInput, LargeTextInput];
};

type LargeIncreaseOperation = {
  name: string;
  description: string;
  format: string;
  type: OperationTypes.INCREASE;
  inputs: [LargeTextInput, LargeTextInput];
};

type LargeDecreaseOperation = {
  name: string;
  description: string;
  format: string;
  type: OperationTypes.DECREASE;
  inputs: [LargeTextInput, LargeTextInput];
};

type LargeIfOperation = {
  name: string;
  description: string;
  format: string;
  type: OperationTypes.IF;
  inputs: [LargeTextInput, LargeOperationBoxInput];
};

type LargeWhileOperation = {
  name: string;
  description: string;
  format: string;
  type: OperationTypes.WHILE;
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
