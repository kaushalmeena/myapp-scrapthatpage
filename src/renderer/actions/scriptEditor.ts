import { LargeOperation } from "../../common/types/largeOperation";
import { Variable, VariablePicker } from "../../common/types/variable";
import {
  InformationUpdateAction,
  InputUpdateAction,
  InputUpdateWithVariableAction,
  OperationAppendAction,
  OperationDeleteAction,
  OperationMoveDownAction,
  OperationMoveUpAction,
  OperationSelectorHideAction,
  OperationSelectorShowAction,
  ScriptEditorState,
  StateLoadAction,
  VariableSelectorHideAction,
  VariableSelectorShowAction
} from "../types/scriptEditor";

export const enum ACTION_TYPES {
  STATE_LOAD = "STATE_LOAD",
  INFORMATION_UPDATE = "INFORMATION_UPDATE",
  OPERATION_APPEND = "OPERATION_APPEND",
  OPERATION_DELETE = "OPERATION_DELETE",
  OPERATION_MOVE_UP = "OPERATION_MOVE_UP",
  OPERATION_MOVE_DOWN = "OPERATION_MOVE_DOWN",
  INPUT_UPDATE = "INPUT_UPDATE",
  INPUT_UPDATE_WITH_VARIABLE = "INPUT_UPDATE_WITH_VARIABLE",
  OPERATION_SELECTOR_SHOW = "OPERATION_SELECTOR_SHOW",
  OPERATION_SELECTOR_HIDE = "OPERATION_SELECTOR_HIDE",
  VARIABLE_SELECTOR_SHOW = "VARIABLE_SELECTOR_SHOW",
  VARIABLE_SELECTOR_HIDE = "VARIABLE_SELECTOR_HIDE"
}

export const loadState = (state: ScriptEditorState): StateLoadAction => ({
  type: ACTION_TYPES.STATE_LOAD,
  payload: {
    state
  }
});

export const updateInformation = (
  value: string,
  key: string
): InformationUpdateAction => ({
  type: ACTION_TYPES.INFORMATION_UPDATE,
  payload: {
    value,
    key
  }
});

export const appendOperation = (
  operation: LargeOperation
): OperationAppendAction => ({
  type: ACTION_TYPES.OPERATION_APPEND,
  payload: {
    operation
  }
});

export const deleteOperation = (path: string): OperationDeleteAction => ({
  type: ACTION_TYPES.OPERATION_DELETE,
  payload: {
    path
  }
});

export const moveUpOperation = (path: string): OperationMoveUpAction => ({
  type: ACTION_TYPES.OPERATION_MOVE_UP,
  payload: {
    path
  }
});

export const moveDownOperation = (path: string): OperationMoveDownAction => ({
  type: ACTION_TYPES.OPERATION_MOVE_DOWN,
  payload: {
    path
  }
});

export const updateInput = (
  value: string,
  path: string
): InputUpdateAction => ({
  type: ACTION_TYPES.INPUT_UPDATE,
  payload: {
    value,
    path
  }
});

export const updateInputWithVariable = (
  variable: Variable
): InputUpdateWithVariableAction => ({
  type: ACTION_TYPES.INPUT_UPDATE_WITH_VARIABLE,
  payload: {
    variable
  }
});

export const showOperationSelector = (
  path: string
): OperationSelectorShowAction => ({
  type: ACTION_TYPES.OPERATION_SELECTOR_SHOW,
  payload: {
    path
  }
});

export const hideOperationSelector = (): OperationSelectorHideAction => ({
  type: ACTION_TYPES.OPERATION_SELECTOR_HIDE
});

export const showVariableSelector = (
  path: string
): VariableSelectorShowAction => ({
  type: ACTION_TYPES.VARIABLE_SELECTOR_SHOW,
  payload: {
    path
  }
});

export const hideVariableSelector = (): VariableSelectorHideAction => ({
  type: ACTION_TYPES.VARIABLE_SELECTOR_HIDE
});
