import {
  VARIABLE_PICKER_MODES,
  VARIABLE_TYPES
} from "../../../common/constants/variable";
import { LargeOperation } from "../../../common/types/largeOperation";
import { ValidationRule } from "../../../common/types/validation";
import { Variable } from "../../../common/types/variable";

// ScriptEditor state types
export type InformationField = {
  value: string;
  error: string;
  rules: ValidationRule[];
};

export type Information = {
  name: InformationField;
  description: InformationField;
};

export type OperationSelector = {
  visible: boolean;
  activePath: string;
};

export type VariableSelector = {
  visible: boolean;
  activePath: string;
  filterType: VARIABLE_TYPES;
  updateMode: VARIABLE_PICKER_MODES;
};

export type ScriptEditorState = {
  id?: number;
  favorite: number;
  information: Information;
  operations: LargeOperation[];
  variables: Variable[];
  variableSelector: VariableSelector;
  operationSelector: OperationSelector;
};

// ScriptEditor payload types
export type UpdateStateActionPayload = {
  state: ScriptEditorState;
};

export type UpdateInformationActionPayload = {
  key: string;
  value: string;
};

export type AppendOperationActionPayload = {
  operation: LargeOperation;
};

export type DeleteOperationActionPayload = {
  path: string;
};

export type MoveUpOperationActionPayload = {
  path: string;
};

export type MoveDownOperationActionPayload = {
  path: string;
};

export type UpdateInputActionPayload = {
  path: string;
  value: string;
};

export type UpdateInputWithVariableActionPayload = {
  variable: Variable;
};

export type ShowOperationSelectorActionPayload = {
  path: string;
};

export type ShowVariableSelectorActionPayload = {
  path: string;
};

// ScriptEditor utils types
export type OperationsPathAndIndex = {
  operationsPath: string;
  index: number;
};

export type ValidatedData = {
  errors: string[];
  newState: ScriptEditorState;
};
