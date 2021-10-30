import { INPUT_TYPES, OPERATION_TYPES } from "../constants/operations";

type TextInput = {
  type: INPUT_TYPES.TEXT;
  value: string;
};

type TextAreaInput = {
  type: INPUT_TYPES.TEXTAREA;
  value: string;
};

type OperationBoxInput = {
  type: INPUT_TYPES.OPERATION_BOX;
  operations: SmallOperation[];
};

export type SmallInput = TextInput | TextAreaInput | OperationBoxInput;

export type SmallOperation = {
  type: OPERATION_TYPES;
  inputs: SmallInput[];
};

export type Script = {
  id: string;
  name: string;
  description: string;
  operations: SmallOperation[];
};
