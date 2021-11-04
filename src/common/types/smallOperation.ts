import { INPUT_TYPES } from "../constants/input";
import { OPERATION_TYPES } from "../constants/operation";

type SmallTextInput = {
  type: INPUT_TYPES.TEXT;
  value: string;
};

type SmallTextAreaInput = {
  type: INPUT_TYPES.TEXTAREA;
  value: string;
};

type SmallOperationBoxInput = {
  type: INPUT_TYPES.OPERATION_BOX;
  operations: SmallOperation[];
};

export type SmallInput =
  | SmallTextInput
  | SmallTextAreaInput
  | SmallOperationBoxInput;

export type SmallOperation = {
  type: OPERATION_TYPES;
  inputs: SmallInput[];
};
