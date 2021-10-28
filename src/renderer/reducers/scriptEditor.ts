import produce from "immer";
import { del, get, push, set } from "object-path";
import { ACTION_TYPES, ScriptEditorAction } from "../actions/scriptEditor";
import { IScriptEditorState } from "../interfaces/scriptEditor";
import { validateInput } from "../utils/operations";

export const scriptEditorReducer = (
  state: IScriptEditorState,
  action: ScriptEditorAction
): IScriptEditorState => {
  console.log("========= action", action);
  switch (action.type) {
    case ACTION_TYPES.CHANGE_TAB:
      return produce(state, (draft) => {
        draft.activeTab = action.payload.value;
      });
    case ACTION_TYPES.SET_NAME:
      return produce(state, (draft) => {
        draft.information.name.value = action.payload.value;
        draft.information.name.error = validateInput(
          action.payload.value,
          state.information.name.rules
        );
      });
    case ACTION_TYPES.SET_DESCRIPTION:
      return produce(state, (draft) => {
        draft.information.description.value = action.payload.value;
        draft.information.description.error = validateInput(
          action.payload.value,
          draft.information.description.rules
        );
      });
    case ACTION_TYPES.OPEN_SELECTOR:
      return produce(state, (draft) => {
        draft.selector.visible = true;
        draft.selector.activePath = action.payload.path;
      });
    case ACTION_TYPES.CLOSE_SELECTOR:
      return produce(state, (draft) => {
        draft.selector.visible = false;
      });
    case ACTION_TYPES.TOOGLE_CARD_CONTENT:
      return produce(state, (draft) => {
        const path = `${action.payload.path}.expanded`;
        set(draft, path, !get(draft, path));
      });
    case ACTION_TYPES.APPEND_OPERATION:
      return produce(state, (draft) => {
        push(draft, draft.selector.activePath, action.payload.operation);
      });
    case ACTION_TYPES.DELETE_OPERATION:
      return produce(state, (draft) => {
        del(draft, action.payload.path);
      });
    case ACTION_TYPES.MOVE_UP_OPERATION:
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
    case ACTION_TYPES.MOVE_DOWN_OPERATION:
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
    case ACTION_TYPES.UPDATE_INPUT:
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
