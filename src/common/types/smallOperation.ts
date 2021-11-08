import { INPUT_TYPES } from "../constants/input";
import { OPERATION_TYPES } from "../constants/operation";

export type SmallTextInput = {
  type: INPUT_TYPES.TEXT;
  value: string;
};

export type SmallSelectInput = {
  type: INPUT_TYPES.SELECT;
  value: string;
};

export type SmallOperationBoxInput = {
  type: INPUT_TYPES.OPERATION_BOX;
  operations: SmallOperation[];
};

type SmallOpenOperation = {
  type: OPERATION_TYPES.OPEN;
  inputs: [SmallTextInput];
};

type SmallExtractOperation = {
  type: OPERATION_TYPES.EXTRACT;
  inputs: [SmallTextInput, SmallTextInput];
};

type SmallClickOperation = {
  type: OPERATION_TYPES.CLICK;
  inputs: [SmallTextInput];
};

type SmallTypeOperation = {
  type: OPERATION_TYPES.TYPE;
  inputs: [SmallTextInput, SmallTextInput];
};

type SmallSetOperation = {
  type: OPERATION_TYPES.SET;
  inputs: [SmallTextInput, SmallSelectInput, SmallTextInput];
};

type SmallIncreaseOperation = {
  type: OPERATION_TYPES.INCREASE;
  inputs: [SmallTextInput, SmallTextInput];
};

type SmallDecreaseOperation = {
  type: OPERATION_TYPES.DECREASE;
  inputs: [SmallTextInput, SmallTextInput];
};

type SmallIfOperation = {
  type: OPERATION_TYPES.IF;
  inputs: [SmallTextInput, SmallOperationBoxInput];
};

type SmallWhileOperation = {
  type: OPERATION_TYPES.WHILE;
  inputs: [SmallTextInput, SmallOperationBoxInput];
};

export type SmallInput =
  | SmallTextInput
  | SmallSelectInput
  | SmallOperationBoxInput;

export type SmallOperation =
  | SmallOpenOperation
  | SmallExtractOperation
  | SmallClickOperation
  | SmallTypeOperation
  | SmallSetOperation
  | SmallIncreaseOperation
  | SmallDecreaseOperation
  | SmallIfOperation
  | SmallWhileOperation;
