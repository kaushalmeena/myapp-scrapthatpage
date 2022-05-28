import { get, wrap } from "object-path-immutable";
import { OPERATION_TYPES } from "../../common/constants/operation";
import { VARIABLE_PICKER_MODES } from "../../common/constants/variable";
import { LargeInput, LargeTextInput } from "../../common/types/largeOperation";
import { Variable } from "../../common/types/variable";
import { ACTION_TYPES } from "../actions/scriptEditor";
import { INITIAL_SCRIPT_EDITOR_STATE } from "../constants/scriptEditor";
import { ScriptEditorAction, ScriptEditorState } from "../types/scriptEditor";
import {
  getOperationsPathAndIndex,
  swapScriptEditorOperations,
  updateScriptEditorField
} from "../utils/scriptEditor";

export const scriptEditorReducer = (
  state = INITIAL_SCRIPT_EDITOR_STATE,
  action: ScriptEditorAction
): ScriptEditorState => {
  switch (action.type) {
    case ACTION_TYPES.STATE_LOAD: {
      return action.payload.state;
    }
    case ACTION_TYPES.INFORMATION_UPDATE: {
      const path = `information.${action.payload.key}`;
      const value = action.payload.value;
      return updateScriptEditorField(state, path, value);
    }
    case ACTION_TYPES.OPERATION_APPEND: {
      const operation = action.payload.operation;
      const activePath = state.operationSelector.activePath;
      return wrap(state).push(activePath, operation).value();
    }
    case ACTION_TYPES.OPERATION_DELETE: {
      const path = action.payload.path;
      const operation = get(state, path);
      let wrappedState = wrap(state).del(path);
      if (operation.type === OPERATION_TYPES.SET) {
        const oldVariables = get(state, "variables", []) as Variable[];
        const newVariables = oldVariables.filter((item) => item.path !== path);
        wrappedState = wrappedState.set("variables", newVariables);
      }
      return wrappedState.value();
    }
    case ACTION_TYPES.OPERATION_MOVE_UP:
      {
        const path = action.payload.path;
        const { operationsPath, index } = getOperationsPathAndIndex(path);
        if (index > 0) {
          const operationPath1 = `${operationsPath}.${index}`;
          const operationPath2 = `${operationsPath}.${index - 1}`;
          return swapScriptEditorOperations(
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
          return swapScriptEditorOperations(
            state,
            operationPath1,
            operationPath2
          );
        }
      }
      break;
    case ACTION_TYPES.INPUT_UPDATE: {
      const path = action.payload.path;
      const value = action.payload.value;
      return updateScriptEditorField(state, path, value);
    }
    case ACTION_TYPES.INPUT_UPDATE_WITH_VARIABLE: {
      const variable = action.payload.variable;
      const activePath = state.variableSelector.activePath;
      const updateMode = state.variableSelector.updateMode;

      const valuePath = `${activePath}.value`;
      const value = get(state, valuePath);

      let newValue = "";
      switch (updateMode) {
        case VARIABLE_PICKER_MODES.SET:
          newValue = variable.name;
          break;
        case VARIABLE_PICKER_MODES.APPEND:
          newValue = `${value}{{${variable.name}}}`;
          break;
      }

      return updateScriptEditorField(state, activePath, newValue);
    }
    case ACTION_TYPES.OPERATION_SELECTOR_SHOW: {
      const path = action.payload.path;
      return wrap(state)
        .set("operationSelector.visible", true)
        .set("operationSelector.activePath", path)
        .value();
    }
    case ACTION_TYPES.OPERATION_SELECTOR_HIDE: {
      return wrap(state).set("operationSelector.visible", false).value();
    }
    case ACTION_TYPES.VARIABLE_SELECTOR_SHOW: {
      const path = action.payload.path;
      const input = get(state, path);
      if ("variablePicker" in input && input.variablePicker) {
        const variablePicker = input.variablePicker;
        return wrap(state)
          .set("variableSelector.visible", true)
          .set("variableSelector.activePath", path)
          .set("variableSelector.filterType", variablePicker.type)
          .set("variableSelector.updateMode", variablePicker.mode)
          .value();
      }
    }
    case ACTION_TYPES.VARIABLE_SELECTOR_HIDE: {
      return wrap(state).set("variableSelector.visible", false).value();
    }
    default:
  }
  return state;
};
