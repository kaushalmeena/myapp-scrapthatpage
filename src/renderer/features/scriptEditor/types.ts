import {
  VariablePickerModes,
  VariableTypes
} from "../../../common/constants/variable";
import { LargeOperation } from "../../../common/types/largeOperation";
import { ValidationRule } from "../../../common/types/validation";
import { Variable } from "../../../common/types/variable";

// ScriptEditor state types
export type EditorInputField = {
  value: string;
  error: string;
  rules: ValidationRule[];
};

export type InformationSection = {
  name: EditorInputField;
  description: EditorInputField;
};

export type OperationSelector = {
  visible: boolean;
  activePath: string;
};

export type VariableSelector = {
  visible: boolean;
  activePath: string;
  filterType: VariableTypes;
  updateMode: VariablePickerModes;
};

export type ScriptEditorState = {
  id?: number;
  favorite: number;
  information: InformationSection;
  operations: LargeOperation[];
  variables: Variable[];
  variableSelector: VariableSelector;
  operationSelector: OperationSelector;
};

// ScriptEditor payload types
export type UpdateInformationActionPayload = {
  key: string;
  value: string;
};

export type UpdateInputActionPayload = {
  path: string;
  value: string;
};
