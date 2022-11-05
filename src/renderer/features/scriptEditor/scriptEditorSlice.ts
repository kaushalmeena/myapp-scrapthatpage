import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { get } from "lodash";
import { OperationTypes } from "../../../common/constants/operation";
import {
  LargeInput,
  LargeOperation
} from "../../../common/types/largeOperation";
import { Variable } from "../../../common/types/variable";
import { StoreRootState } from "../../types/store";
import { INITIAL_SCRIPT_EDITOR_STATE } from "./constants";
import {
  ScriptEditorState,
  UpdateInformationActionPayload,
  UpdateInputActionPayload
} from "./types";
import {
  getOperationsPathAndIndex,
  getUpdatedInputValueWithVariable,
  updateDraftScriptEditorField
} from "./utils";

const scriptEditorSlice = createSlice({
  name: "scriptEditor",
  initialState: INITIAL_SCRIPT_EDITOR_STATE,
  reducers: {
    updateState(_, action: PayloadAction<ScriptEditorState>) {
      const state = action.payload;
      return state;
    },
    updateInformation(
      state,
      action: PayloadAction<UpdateInformationActionPayload>
    ) {
      const { key, value } = action.payload;
      const fieldPath = `information.${key}`;
      updateDraftScriptEditorField(state, fieldPath, value);
    },
    appendOperation(state, action: PayloadAction<LargeOperation>) {
      const operation = action.payload;
      const { activePath } = state.operationSelector;
      const operations = get(state, activePath) as LargeOperation[];
      operations.push(operation);
    },
    deleteOperation(state, action: PayloadAction<string>) {
      const path = action.payload;
      const { operationsPath, index } = getOperationsPathAndIndex(path);
      const operations = get(state, operationsPath) as LargeOperation[];
      const [deletedOperation] = operations.splice(index, 1);
      if (deletedOperation?.type === OperationTypes.SET) {
        const oldVariables = state.variables;
        const newVariables = oldVariables.filter((item) => item.path !== path);
        state.variables = newVariables;
      }
    },
    moveUpOperation(state, action: PayloadAction<string>) {
      const path = action.payload;
      const { operationsPath, index } = getOperationsPathAndIndex(path);
      const operations = get(state, operationsPath) as LargeOperation[];
      if (index > 0) {
        const tempOperation = operations[index];
        operations[index] = operations[index - 1];
        operations[index - 1] = tempOperation;
      }
    },
    moveDownOperation(state, action: PayloadAction<string>) {
      const path = action.payload;
      const { operationsPath, index } = getOperationsPathAndIndex(path);
      const operations = get(state, operationsPath) as LargeOperation[];
      if (index < operations.length - 1) {
        const tempOperation = operations[index];
        operations[index] = operations[index + 1];
        operations[index + 1] = tempOperation;
      }
    },
    updateInput(state, action: PayloadAction<UpdateInputActionPayload>) {
      const { path, value } = action.payload;
      updateDraftScriptEditorField(state, path, value);
    },
    updateInputWithVariable(state, action: PayloadAction<Variable>) {
      const variable = action.payload;
      const { activePath, updateMode } = state.variableSelector;
      const valuePath = `${activePath}.value`;
      const value = get(state, valuePath) as string;
      const newValue = getUpdatedInputValueWithVariable(
        value,
        updateMode,
        variable
      );
      updateDraftScriptEditorField(state, activePath, newValue);
    },
    showOperationSelector(state, action: PayloadAction<string>) {
      const path = action.payload;
      state.operationSelector.visible = true;
      state.operationSelector.activePath = path;
    },
    hideOperationSelector(state) {
      state.operationSelector.visible = false;
    },
    showVariableSelector(state, action: PayloadAction<string>) {
      const path = action.payload;
      const field = get(state, path) as LargeInput;
      if ("variablePicker" in field && field.variablePicker) {
        const { variablePicker } = field;
        state.variableSelector.visible = true;
        state.variableSelector.activePath = path;
        state.variableSelector.filterType = variablePicker.type;
        state.variableSelector.updateMode = variablePicker.mode;
      }
    },
    hideVariableSelector(state) {
      state.variableSelector.visible = false;
    }
  }
});

// ScriptEditor actions
export const {
  updateState,
  updateInformation,
  appendOperation,
  deleteOperation,
  moveUpOperation,
  moveDownOperation,
  updateInput,
  updateInputWithVariable,
  showOperationSelector,
  hideOperationSelector,
  showVariableSelector,
  hideVariableSelector
} = scriptEditorSlice.actions;

// ScriptEditor reducer
export const scriptEditorReducer = scriptEditorSlice.reducer;

// ScriptEditor selectors
export const selectInformation = (state: StoreRootState) =>
  state.scriptEditor.information;
export const selectOperationSelector = (state: StoreRootState) =>
  state.scriptEditor.operationSelector;
export const selectVariableSelectorAndVariables = (state: StoreRootState) => ({
  selector: state.scriptEditor.variableSelector,
  variables: state.scriptEditor.variables
});
