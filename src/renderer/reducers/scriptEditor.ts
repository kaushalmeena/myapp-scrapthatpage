import { get, wrap } from "object-path-immutable";
import { ACTION_TYPES } from "../actions/scriptEditor";
import { ScriptEditorAction, ScriptEditorState } from "../types/scriptEditor";
import {
  getOperationsPathAndIndex,
  swapScriptEditorOperations,
  updateScriptEditorField
} from "../utils/scriptEditor";

export const scriptEditorReducer = (
  state: ScriptEditorState,
  action: ScriptEditorAction
): ScriptEditorState => {
  switch (action.type) {
    case ACTION_TYPES.STATE_LOAD:
      {
        state = action.payload.state;
      }
      break;
    case ACTION_TYPES.INFORMATION_UPDATE:
      {
        const path = `information.${action.payload.key}`;
        const value = action.payload.value;
        state = updateScriptEditorField(state, path, value);
      }
      break;
    case ACTION_TYPES.OPERATION_APPEND:
      {
        const operation = action.payload.operation;
        const activePath = state.selector.operation.activePath;
        state = wrap(state).push(activePath, operation).value();
      }
      break;
    case ACTION_TYPES.OPERATION_DELETE:
      {
        const path = action.payload.path;
        state = wrap(state).del(path).value();
      }
      break;
    case ACTION_TYPES.OPERATION_MOVE_UP:
      {
        const path = action.payload.path;
        const { operationsPath, index } = getOperationsPathAndIndex(path);
        if (index > 0) {
          const operationPath1 = `${operationsPath}.${index}`;
          const operationPath2 = `${operationsPath}.${index - 1}`;
          state = swapScriptEditorOperations(
            state,
            operationPath1,
            operationPath2
          );
        }
      }
      break;
    case ACTION_TYPES.OPERATION_MOVE_DOWN:
      {
        const path = action.payload.path;
        const { operationsPath, index } = getOperationsPathAndIndex(path);
        const operationsLength = get(state, `${operationsPath}.length`);
        if (index < operationsLength - 1) {
          const operationPath1 = `${operationsPath}.${index}`;
          const operationPath2 = `${operationsPath}.${index + 1}`;
          state = swapScriptEditorOperations(
            state,
            operationPath1,
            operationPath2
          );
        }
      }
      break;
    case ACTION_TYPES.INPUT_UPDATE:
      {
        const path = action.payload.path;
        const value = action.payload.value;
        state = updateScriptEditorField(state, path, value);
      }
      break;
    case ACTION_TYPES.INPUT_UPDATE_WITH_VARIABLE:
      {
        const variable = action.payload.variable;
        const activePath = state.selector.variable.activePath;
        const updateMode = state.selector.variable.updateMode;

        const valuePath = `${activePath}.value`;
        const value = get(state, valuePath);

        let newValue = "";
        switch (updateMode) {
          case "SET":
            newValue = variable.name;
            break;
          case "APPEND":
            newValue = `${value}{{${variable.name}}}`;
            break;
        }

        state = updateScriptEditorField(state, activePath, newValue);
      }
      break;
    case ACTION_TYPES.OPERATION_SELECTOR_OPEN:
      {
        const path = action.payload.path;
        state = wrap(state)
          .set("selector.operation.visible", true)
          .set("selector.operation.activePath", path)
          .value();
      }
      break;
    case ACTION_TYPES.OPERATION_SELECTOR_CLOSE:
      {
        state = wrap(state).set("selector.operation.visible", false).value();
      }
      break;
    case ACTION_TYPES.VARIABLE_SELECTOR_OPEN:
      {
        const path = action.payload.path;
        const picker = action.payload.picker;
        state = wrap(state)
          .set("selector.variable.visible", true)
          .set("selector.variable.activePath", path)
          .set("selector.variable.filterType", picker.type)
          .set("selector.variable.updateMode", picker.mode)
          .value();
      }
      break;
    case ACTION_TYPES.VARIABLE_SELECTOR_CLOSE: {
      state = wrap(state).set("selector.variable.visible", false).value();
    }
    default:
  }
  return state;
};
