import { LargeOperation } from "../../common/types/largeOperation";
import {
  Variable,
  VariableFilterType,
  VariablePicker,
  VariableUpdateMode
} from "../../common/types/variable";
import { ACTION_TYPES } from "../actions/scriptEditor";
import { Information } from "./information";

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

export type OperationSelector = {
  visible: boolean;
  activePath: string;
};

export type VariableSelector = {
  visible: boolean;
  activePath: string;
  filterType: VariableFilterType;
  updateMode: VariableUpdateMode;
};

export type ModalSelector = {
  operation: OperationSelector;
  variable: VariableSelector;
};

export type ScriptEditorState = {
  id?: number;
  favorite: number;
  information: Information;
  operations: LargeOperation[];
  selector: ModalSelector;
};

export type OperationsPathAndIndex = {
  operationsPath: string;
  index: number;
};

export type ValidatedData = {
  errors: string[];
  newState: ScriptEditorState;
};
