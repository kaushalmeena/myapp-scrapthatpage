import { GridSize } from "@mui/material";
import { INPUT_TYPES } from "../constants/input";
import { OPERATION_TYPES } from "../constants/operation";
import { ValidationRule } from "./validation";

type LargeTextInput = {
  label: string;
  type: INPUT_TYPES.TEXT;
  width: GridSize;
  value: string;
  error: string;
  rules: ValidationRule[];
  variableInputAllowed?: boolean;
};

type LargeOperationBoxInput = {
  label: string;
  type: INPUT_TYPES.OPERATION_BOX;
  operations: LargeOperation[];
};

type LargeOpenOperation = {
  name: string;
  description: string;
  format: string;
  type: OPERATION_TYPES.OPEN;
  inputs: [LargeTextInput];
};

type LargeExtractOperation = {
  name: string;
  description: string;
  format: string;
  type: OPERATION_TYPES.EXTRACT;
  inputs: [LargeTextInput, LargeTextInput];
};

type LargeClickOperation = {
  name: string;
  description: string;
  format: string;
  type: OPERATION_TYPES.CLICK;
  inputs: [LargeTextInput];
};

type LargeTypeOperation = {
  name: string;
  description: string;
  format: string;
  type: OPERATION_TYPES.TYPE;
  inputs: [LargeTextInput, LargeTextInput];
};

type LargeSetOperation = {
  name: string;
  description: string;
  format: string;
  type: OPERATION_TYPES.SET;
  inputs: [LargeTextInput, LargeTextInput];
};

type LargeIncreaseOperation = {
  name: string;
  description: string;
  format: string;
  type: OPERATION_TYPES.INCREASE;
  inputs: [LargeTextInput, LargeTextInput];
};

type LargeDecreaseOperation = {
  name: string;
  description: string;
  format: string;
  type: OPERATION_TYPES.DECREASE;
  inputs: [LargeTextInput, LargeTextInput];
};

type LargeIfOperation = {
  name: string;
  description: string;
  format: string;
  type: OPERATION_TYPES.IF;
  inputs: [LargeTextInput, LargeOperationBoxInput];
};

type LargeWhileOperation = {
  name: string;
  description: string;
  format: string;
  type: OPERATION_TYPES.WHILE;
  inputs: [LargeTextInput, LargeOperationBoxInput];
};

export type LargeInput = LargeTextInput | LargeOperationBoxInput;

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
