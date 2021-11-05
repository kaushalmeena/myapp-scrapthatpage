import { INPUT_TYPES } from "../constants/input";
import { OPERATION_TYPES } from "../constants/operation";
import { ValidationRule } from "./validation";

type LargeTextInput = {
  label: string;
  type: INPUT_TYPES.TEXT;
  width: number | string;
  value: string;
  error: string;
  rules: ValidationRule[];
};

type LargeOperationBoxInput = {
  label: string;
  type: INPUT_TYPES.OPERATION_BOX;
  width: number | string;
  operations: LargeOperation[];
};

type LargeOpenOperation = {
  type: OPERATION_TYPES.OPEN;
  inputs: [LargeTextInput];
};

type LargeExtractOperation = {
  type: OPERATION_TYPES.EXTRACT;
  inputs: [LargeTextInput, LargeTextInput];
};

type LargeClickOperation = {
  type: OPERATION_TYPES.CLICK;
  inputs: [LargeTextInput];
};

type LargeTypeOperation = {
  type: OPERATION_TYPES.TYPE;
  inputs: [LargeTextInput, LargeTextInput];
};

type LargeSetOperation = {
  type: OPERATION_TYPES.SET;
  inputs: [LargeTextInput, LargeTextInput];
};

type LargeIncreaseOperation = {
  type: OPERATION_TYPES.INCREASE;
  inputs: [LargeTextInput, LargeTextInput];
};

type LargeDecreaseOperation = {
  type: OPERATION_TYPES.DECREASE;
  inputs: [LargeTextInput, LargeTextInput];
};

type LargeIfOperation = {
  type: OPERATION_TYPES.IF;
  inputs: [LargeTextInput, LargeOperationBoxInput];
};

type LargeWhileOperation = {
  type: OPERATION_TYPES.WHILE;
  inputs: [LargeTextInput, LargeOperationBoxInput];
};

type LargeOperationCommon = {
  name: string;
  description: string;
  format: string;
};

export type LargeInput = LargeTextInput | LargeOperationBoxInput;

export type LargeOperation = (
  | LargeOpenOperation
  | LargeExtractOperation
  | LargeClickOperation
  | LargeTypeOperation
  | LargeSetOperation
  | LargeIncreaseOperation
  | LargeDecreaseOperation
  | LargeIfOperation
  | LargeWhileOperation
) &
  LargeOperationCommon;
