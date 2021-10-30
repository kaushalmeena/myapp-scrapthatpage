import produce from "immer";
import { del, get, push, set } from "object-path";
import { ACTION_TYPES } from "../actions/scriptEditor";
import { ScriptEditorAction, ScriptEditorState } from "../types/scriptEditor";
import { validateInput } from "../utils/scriptEditor";

export const scriptEditorReducer = (
  state: ScriptEditorState,
  action: ScriptEditorAction
): ScriptEditorState => {
  console.log("========= action", action);
  switch (action.type) {
    case ACTION_TYPES.INFORMATION_UPDATE:
      return produce(state, (draft) => {
        const valuePath = `${action.payload.path}.value`;
        const errorPath = `${action.payload.path}.error`;
        const rulesPath = `${action.payload.path}.rules`;
        const value = action.payload.value;
        const rules = get(draft, rulesPath);
        const error = validateInput(value, rules);
        set(draft, valuePath, value);
        set(draft, errorPath, error);
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
        const tempPath = action.payload.path;
        const lastIndex = tempPath.lastIndexOf(".");
        const operationPath = tempPath.substr(0, lastIndex);
        const operationIndex = Number.parseInt(
          tempPath.substr(lastIndex + 1, 1)
        );
        if (operationIndex > 0) {
          const path1 = `${operationPath}.${operationIndex}`;
          const path2 = `${operationPath}.${operationIndex - 1}`;
          const opr1 = get(draft, path1);
          const opr2 = get(draft, path2);
          set(draft, path1, opr2);
          set(draft, path2, opr1);
        }
      });
    case ACTION_TYPES.OPERATION_MOVE_DOWN:
      return produce(state, (draft) => {
        const tempPath = action.payload.path;
        const lastIndex = tempPath.lastIndexOf(".");
        const operationPath = tempPath.substr(0, lastIndex);
        const operationIndex = Number.parseInt(
          tempPath.substr(lastIndex + 1, 1)
        );
        const operations = get(draft, operationPath);
        if (operationIndex < operations.length - 1) {
          const path1 = `${operationPath}.${operationIndex}`;
          const path2 = `${operationPath}.${operationIndex + 1}`;
          const opr1 = get(draft, path1);
          const opr2 = get(draft, path2);
          set(draft, path1, opr2);
          set(draft, path2, opr1);
        }
      });
    case ACTION_TYPES.OPERATION_UPDATE:
      return produce(state, (draft) => {
        const valuePath = `${action.payload.path}.value`;
        const errorPath = `${action.payload.path}.error`;
        const rulesPath = `${action.payload.path}.rules`;
        const value = action.payload.value;
        const rules = get(draft, rulesPath);
        const error = validateInput(value, rules);
        set(draft, valuePath, value);
        set(draft, errorPath, error);
      });
    default:
  }
  return state;
};
