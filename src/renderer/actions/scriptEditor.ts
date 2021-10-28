import { IOperationLarge } from "../interfaces/operations";

export enum ACTION_TYPES {
  CHANGE_TAB,
  SET_NAME,
  SET_DESCRIPTION,
  OPEN_SELECTOR,
  CLOSE_SELECTOR,
  TOOGLE_CARD_CONTENT,
  APPEND_OPERATION,
  DELETE_OPERATION,
  MOVE_UP_OPERATION,
  MOVE_DOWN_OPERATION,
  UPDATE_INPUT
}

export type ChangeTabAction = {
  type: ACTION_TYPES.CHANGE_TAB;
  payload: {
    value: number;
  };
};

export type SetNameAction = {
  type: ACTION_TYPES.SET_NAME;
  payload: {
    value: string;
  };
};

export type SetDescriptionAction = {
  type: ACTION_TYPES.SET_DESCRIPTION;
  payload: {
    value: string;
  };
};

export type OpenSelectorAction = {
  type: ACTION_TYPES.OPEN_SELECTOR;
  payload: {
    path: string;
  };
};

export type CloseSelectorAction = {
  type: ACTION_TYPES.CLOSE_SELECTOR;
};

export type ToggleCardContentAction = {
  type: ACTION_TYPES.TOOGLE_CARD_CONTENT;
  payload: {
    path: string;
  };
};

export type AppendOperationAction = {
  type: ACTION_TYPES.APPEND_OPERATION;
  payload: {
    operation: IOperationLarge;
  };
};

export type DeleteOperationAction = {
  type: ACTION_TYPES.DELETE_OPERATION;
  payload: {
    path: string;
  };
};

export type MoveUpOperationAction = {
  type: ACTION_TYPES.MOVE_UP_OPERATION;
  payload: {
    path: string;
  };
};

export type MoveDownOperationAction = {
  type: ACTION_TYPES.MOVE_DOWN_OPERATION;
  payload: {
    path: string;
  };
};

export type UpdateInputAction = {
  type: ACTION_TYPES.UPDATE_INPUT;
  payload: {
    path: string;
    value: string;
  };
};

export type ScriptEditorAction =
  | ChangeTabAction
  | SetNameAction
  | SetDescriptionAction
  | OpenSelectorAction
  | CloseSelectorAction
  | ToggleCardContentAction
  | AppendOperationAction
  | DeleteOperationAction
  | MoveUpOperationAction
  | MoveDownOperationAction
  | UpdateInputAction;

export const changeTab = (value: number): ChangeTabAction => ({
  type: ACTION_TYPES.CHANGE_TAB,
  payload: {
    value
  }
});

export const setName = (value: string): SetNameAction => ({
  type: ACTION_TYPES.SET_NAME,
  payload: {
    value
  }
});

export const setDescription = (value: string): SetDescriptionAction => ({
  type: ACTION_TYPES.SET_DESCRIPTION,
  payload: {
    value
  }
});

export const openSelector = (path: string): OpenSelectorAction => ({
  type: ACTION_TYPES.OPEN_SELECTOR,
  payload: {
    path
  }
});

export const closeSelector = (): CloseSelectorAction => ({
  type: ACTION_TYPES.CLOSE_SELECTOR
});

export const toogleCardContent = (path: string): ToggleCardContentAction => ({
  type: ACTION_TYPES.TOOGLE_CARD_CONTENT,
  payload: {
    path
  }
});

export const moveUpOperation = (path: string): MoveUpOperationAction => ({
  type: ACTION_TYPES.MOVE_UP_OPERATION,
  payload: {
    path
  }
});

export const moveDownOperation = (path: string): MoveDownOperationAction => ({
  type: ACTION_TYPES.MOVE_DOWN_OPERATION,
  payload: {
    path
  }
});

export const appendOperation = (
  operation: IOperationLarge
): AppendOperationAction => ({
  type: ACTION_TYPES.APPEND_OPERATION,
  payload: {
    operation
  }
});

export const deleteOperation = (path: string): DeleteOperationAction => ({
  type: ACTION_TYPES.DELETE_OPERATION,
  payload: {
    path
  }
});

export const updateInput = (
  value: string,
  path: string
): UpdateInputAction => ({
  type: ACTION_TYPES.UPDATE_INPUT,
  payload: {
    value,
    path
  }
});
