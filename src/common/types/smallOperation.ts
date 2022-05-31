import { InputTypes } from "../constants/input";
import { OperationTypes } from "../constants/operation";

export type SmallTextInput = {
  type: InputTypes.TEXT;
  value: string;
};

export type SmallSelectInput = {
  type: InputTypes.SELECT;
  value: string;
};

export type SmallOperationBoxInput = {
  type: InputTypes.OPERATION_BOX;
  operations: SmallOperation[];
};

type SmallOpenOperation = {
  type: OperationTypes.OPEN;
  inputs: [SmallTextInput];
};

type SmallExtractOperation = {
  type: OperationTypes.EXTRACT;
  inputs: [SmallTextInput, SmallTextInput, SmallSelectInput];
};

type SmallClickOperation = {
  type: OperationTypes.CLICK;
  inputs: [SmallTextInput];
};

type SmallTypeOperation = {
  type: OperationTypes.TYPE;
  inputs: [SmallTextInput, SmallTextInput];
};

type SmallSetOperation = {
  type: OperationTypes.SET;
  inputs: [SmallTextInput, SmallSelectInput, SmallTextInput];
};

type SmallIncreaseOperation = {
  type: OperationTypes.INCREASE;
  inputs: [SmallTextInput, SmallTextInput];
};

type SmallDecreaseOperation = {
  type: OperationTypes.DECREASE;
  inputs: [SmallTextInput, SmallTextInput];
};

type SmallIfOperation = {
  type: OperationTypes.IF;
  inputs: [SmallTextInput, SmallOperationBoxInput];
};

type SmallWhileOperation = {
  type: OperationTypes.WHILE;
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
