// "Stored" operations are the compact form of a script action: just the input
// type and value(s), with no editor metadata. This is what gets persisted to
// the database and fed to the runner. Its rich counterpart used while editing
// is the "Form" operation (see formOperation.ts); the two are converted back
// and forth in common/utils/operation.ts.

export type StoredTextInput = {
  type: "text";
  value: string;
};

export type StoredSelectInput = {
  type: "select";
  value: string;
};

export type StoredOperationBoxInput = {
  type: "operation_box";
  operations: StoredOperation[];
};

type StoredOpenOperation = {
  type: "open";
  inputs: [StoredTextInput];
};

type StoredExtractOperation = {
  type: "extract";
  inputs: [StoredTextInput, StoredTextInput, StoredSelectInput];
};

type StoredClickOperation = {
  type: "click";
  inputs: [StoredTextInput];
};

type StoredTypeOperation = {
  type: "type";
  inputs: [StoredTextInput, StoredTextInput];
};

type StoredSetOperation = {
  type: "set";
  inputs: [StoredTextInput, StoredSelectInput, StoredTextInput];
};

type StoredIncreaseOperation = {
  type: "increase";
  inputs: [StoredTextInput, StoredTextInput];
};

type StoredDecreaseOperation = {
  type: "decrease";
  inputs: [StoredTextInput, StoredTextInput];
};

type StoredIfOperation = {
  type: "if";
  inputs: [StoredTextInput, StoredOperationBoxInput];
};

type StoredWhileOperation = {
  type: "while";
  inputs: [StoredTextInput, StoredOperationBoxInput];
};

type StoredWaitOperation = {
  type: "wait";
  inputs: [StoredTextInput, StoredTextInput];
};

type StoredDelayOperation = {
  type: "delay";
  inputs: [StoredTextInput];
};

type StoredScrollOperation = {
  type: "scroll";
  inputs: [StoredTextInput];
};

export type StoredInput =
  | StoredTextInput
  | StoredSelectInput
  | StoredOperationBoxInput;

export type StoredOperation =
  | StoredOpenOperation
  | StoredExtractOperation
  | StoredClickOperation
  | StoredTypeOperation
  | StoredSetOperation
  | StoredIncreaseOperation
  | StoredDecreaseOperation
  | StoredIfOperation
  | StoredWhileOperation
  | StoredWaitOperation
  | StoredDelayOperation
  | StoredScrollOperation;
