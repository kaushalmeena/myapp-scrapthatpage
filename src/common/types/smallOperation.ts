// "Small" operations are the compact form of a script action: just the input
// type and value(s), with no editor metadata. This is what gets persisted to
// the database and fed to the runner. Its rich counterpart used while editing
// is the "Large" operation (see largeOperation.ts); the two are converted back
// and forth in common/utils/operation.ts.

export type SmallTextInput = {
  type: "text";
  value: string;
};

export type SmallSelectInput = {
  type: "select";
  value: string;
};

export type SmallOperationBoxInput = {
  type: "operation_box";
  operations: SmallOperation[];
};

type SmallOpenOperation = {
  type: "open";
  inputs: [SmallTextInput];
};

type SmallExtractOperation = {
  type: "extract";
  inputs: [SmallTextInput, SmallTextInput, SmallSelectInput];
};

type SmallClickOperation = {
  type: "click";
  inputs: [SmallTextInput];
};

type SmallTypeOperation = {
  type: "type";
  inputs: [SmallTextInput, SmallTextInput];
};

type SmallSetOperation = {
  type: "set";
  inputs: [SmallTextInput, SmallSelectInput, SmallTextInput];
};

type SmallIncreaseOperation = {
  type: "increase";
  inputs: [SmallTextInput, SmallTextInput];
};

type SmallDecreaseOperation = {
  type: "decrease";
  inputs: [SmallTextInput, SmallTextInput];
};

type SmallIfOperation = {
  type: "if";
  inputs: [SmallTextInput, SmallOperationBoxInput];
};

type SmallWhileOperation = {
  type: "while";
  inputs: [SmallTextInput, SmallOperationBoxInput];
};

export type SmallInput =
  SmallTextInput | SmallSelectInput | SmallOperationBoxInput;

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
