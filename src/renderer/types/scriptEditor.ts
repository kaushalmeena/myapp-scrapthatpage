import {
  VARIABLE_TYPES,
  VARIABLE_PICKER_MODES
} from "../../common/constants/variable";
import { LargeOperation } from "../../common/types/largeOperation";
import { ValidationRule } from "../../common/types/validation";
import { Variable, VariablePicker } from "../../common/types/variable";
import { ACTION_TYPES } from "../actions/scriptEditor";

export type StateLoadAction = {
  type: ACTION_TYPES.STATE_LOAD;
  payload: {
    state: ScriptEditorState;
  };
};

export type InformationUpdateAction = {
  type: ACTION_TYPES.INFORMATION_UPDATE;
  payload: {
    key: string;
    value: string;
  };
};

export type OperationAppendAction = {
  type: ACTION_TYPES.OPERATION_APPEND;
  payload: {
    operation: LargeOperation;
  };
};

export type OperationDeleteAction = {
  type: ACTION_TYPES.OPERATION_DELETE;
  payload: {
    path: string;
  };
};

export type OperationMoveUpAction = {
  type: ACTION_TYPES.OPERATION_MOVE_UP;
  payload: {
    path: string;
  };
};

export type OperationMoveDownAction = {
  type: ACTION_TYPES.OPERATION_MOVE_DOWN;
  payload: {
    path: string;
  };
};

export type InputUpdateAction = {
  type: ACTION_TYPES.INPUT_UPDATE;
  payload: {
    path: string;
    value: string;
  };
};

export type InputUpdateWithVariableAction = {
  type: ACTION_TYPES.INPUT_UPDATE_WITH_VARIABLE;
  payload: {
    variable: Variable;
  };
};

export type OperationSelectorOpenAction = {
  type: ACTION_TYPES.OPERATION_SELECTOR_OPEN;
  payload: {
    path: string;
  };
};

export type OperationSelectorCloseAction = {
  type: ACTION_TYPES.OPERATION_SELECTOR_CLOSE;
};

export type VariableSelectorOpenAction = {
  type: ACTION_TYPES.VARIABLE_SELECTOR_OPEN;
  payload: {
    path: string;
    picker: VariablePicker;
  };
};

export type VariableSelectorCloseAction = {
  type: ACTION_TYPES.VARIABLE_SELECTOR_CLOSE;
};

export type ScriptEditorAction =
  | StateLoadAction
  | InformationUpdateAction
  | OperationAppendAction
  | OperationDeleteAction
  | OperationMoveUpAction
  | OperationMoveDownAction
  | InputUpdateAction
  | InputUpdateWithVariableAction
  | OperationSelectorOpenAction
  | OperationSelectorCloseAction
  | VariableSelectorOpenAction
  | VariableSelectorCloseAction;

type InformationField = {
  value: string;
  error: string;
  rules: ValidationRule[];
};

type Information = {
  name: InformationField;
  description: InformationField;
};

type OperationSelector = {
  visible: boolean;
  activePath: string;
};

type VariableSelector = {
  visible: boolean;
  activePath: string;
  filterType: VARIABLE_TYPES;
  updateMode: VARIABLE_PICKER_MODES;
};

type Selector = {
  operation: OperationSelector;
  variable: VariableSelector;
};

export type ScriptEditorState = {
  id?: number;
  favorite: number;
  information: Information;
  operations: LargeOperation[];
  variables: Variable[];
  selector: Selector;
};

export type OperationsPathAndIndex = {
  operationsPath: string;
  index: number;
};

export type ValidatedData = {
  errors: string[];
  newState: ScriptEditorState;
};
