import produce from "immer";
import { del, get, push } from "object-path";
import { ACTION_TYPES } from "../actions/scriptEditor";
import { ScriptEditorAction, ScriptEditorState } from "../types/scriptEditor";
import {
  getOperationPathAndIndex,
  swapScriptEditorOperations,
  updateScriptEditorField
} from "../utils/scriptEditor";

export const scriptEditorReducer = (
  state: ScriptEditorState,
  action: ScriptEditorAction
): ScriptEditorState => {
  console.log("========= action", action);
  switch (action.type) {
    case ACTION_TYPES.SCRIPT_EDITOR_STATE_LOAD:
      return action.payload.state;
    case ACTION_TYPES.INFORMATION_UPDATE:
      return produce(state, (draft) => {
        const path = `information.${action.payload.key}`;
        updateScriptEditorField(draft, action.payload.value, path);
      });
    case ACTION_TYPES.SELECTOR_OPEN:
      return produce(state, (draft) => {
        draft.selector.visible = true;
        draft.selector.activePath = action.payload.path;
      });
    case ACTION_TYPES.SELECTOR_CLOSE:
      return produce(state, (draft) => {
        draft.selector.visible = false;
      });
    case ACTION_TYPES.OPERATION_APPEND:
      return produce(state, (draft) => {
        push(draft, draft.selector.activePath, action.payload.operation);
      });
    case ACTION_TYPES.OPERATION_DELETE:
      return produce(state, (draft) => {
        del(draft, action.payload.path);
      });
    case ACTION_TYPES.OPERATION_MOVE_UP:
      return produce(state, (draft) => {
        const { operationPath, operationIndex } = getOperationPathAndIndex(
          action.payload.path
        );
        if (operationIndex > 0) {
          const path1 = `${operationPath}.${operationIndex}`;
          const path2 = `${operationPath}.${operationIndex - 1}`;
          swapScriptEditorOperations(draft, path1, path2);
        }
      });
    case ACTION_TYPES.OPERATION_MOVE_DOWN:
      return produce(state, (draft) => {
        const { operationPath, operationIndex } = getOperationPathAndIndex(
          action.payload.path
        );
        const operations = get(draft, operationPath);
        if (operationIndex < operations.length - 1) {
          const path1 = `${operationPath}.${operationIndex}`;
          const path2 = `${operationPath}.${operationIndex + 1}`;
          swapScriptEditorOperations(draft, path1, path2);
        }
      });
    case ACTION_TYPES.OPERATION_UPDATE:
      return produce(state, (draft) => {
        updateScriptEditorField(
          draft,
          action.payload.value,
          action.payload.path
        );
      });
    default:
  }
  return state;
};
