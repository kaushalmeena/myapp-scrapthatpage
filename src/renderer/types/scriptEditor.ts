import { ACTION_TYPES } from "../actions/scriptEditor";
import { Information } from "./information";
import { LargeOperation } from "./largeOperation";

export type ScriptEditorStateLoadAction = {
  type: ACTION_TYPES.SCRIPT_EDITOR_STATE_LOAD;
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

export type SelectorOpenAction = {
  type: ACTION_TYPES.SELECTOR_OPEN;
  payload: {
    path: string;
  };
};

export type SelectorCloseAction = {
  type: ACTION_TYPES.SELECTOR_CLOSE;
};

export type OperationAppendAction = {
  type: ACTION_TYPES.OPERATION_APPEND;
  payload: {
    operation: LargeOperation;
  };
};

export type OperationUpdateAction = {
  type: ACTION_TYPES.OPERATION_UPDATE;
  payload: {
    path: string;
    value: string;
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

export type ScriptEditorAction =
  | ScriptEditorStateLoadAction
  | InformationUpdateAction
  | OperationAppendAction
  | OperationDeleteAction
  | OperationMoveUpAction
  | OperationMoveDownAction
  | OperationUpdateAction
  | SelectorOpenAction
  | SelectorCloseAction;

export type OperationSelector = {
  visible: boolean;
  activePath: string;
};

export type ScriptEditorState = {
  id?: number;
  favourite: number;
  information: Information;
  operations: LargeOperation[];
  selector: OperationSelector;
};