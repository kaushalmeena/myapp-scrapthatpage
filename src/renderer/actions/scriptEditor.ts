import { Operation } from "../types/operation";
import {
  InformationUpdateAction,
  OperationMoveUpAction,
  OperationMoveDownAction,
  OperationDeleteAction,
  OperationUpdateAction,
  OperationAppendAction,
  SelectorOpenAction,
  SelectorCloseAction
} from "../types/scriptEditor";

export enum ACTION_TYPES {
  INFORMATION_UPDATE,
  OPERATION_APPEND,
  OPERATION_UPDATE,
  OPERATION_DELETE,
  OPERATION_MOVE_UP,
  OPERATION_MOVE_DOWN,
  SELECTOR_OPEN,
  SELECTOR_CLOSE
}

export const updateInformation = (
  value: string,
  path: string
): InformationUpdateAction => ({
  type: ACTION_TYPES.INFORMATION_UPDATE,
  payload: {
    value,
    path
  }
});

export const appendOperation = (
  operation: Operation
): OperationAppendAction => ({
  type: ACTION_TYPES.OPERATION_APPEND,
  payload: {
    operation
  }
});

export const updateOperation = (
  value: string,
  path: string
): OperationUpdateAction => ({
  type: ACTION_TYPES.OPERATION_UPDATE,
  payload: {
    value,
    path
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

export const openSelector = (path: string): SelectorOpenAction => ({
  type: ACTION_TYPES.SELECTOR_OPEN,
  payload: {
    path
  }
});

export const closeSelector = (): SelectorCloseAction => ({
  type: ACTION_TYPES.SELECTOR_CLOSE
});
