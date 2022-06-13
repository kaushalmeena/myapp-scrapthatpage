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
      draftState,
      action: PayloadAction<UpdateInformationActionPayload>
    ) {
      const { key, value } = action.payload;
      const fieldPath = `information.${key}`;
      updateDraftScriptEditorField(draftState, fieldPath, value);
    },
    appendOperation(draftState, action: PayloadAction<LargeOperation>) {
      const operation = action.payload;
      const { activePath } = draftState.operationSelector;
      const operations = get(draftState, activePath) as LargeOperation[];
      operations.push(operation);
    },
    deleteOperation(draftState, action: PayloadAction<string>) {
      const path = action.payload;
      const { operationsPath, index } = getOperationsPathAndIndex(path);
      const operations = get(draftState, operationsPath) as LargeOperation[];
      const [deletedOperation] = operations.splice(index, 1);
      if (deletedOperation?.type === OperationTypes.SET) {
        const oldVariables = draftState.variables;
        const newVariables = oldVariables.filter((item) => item.path !== path);
        draftState.variables = newVariables;
      }
    },
    moveUpOperation(draftState, action: PayloadAction<string>) {
      const path = action.payload;
      const { operationsPath, index } = getOperationsPathAndIndex(path);
      const operations = get(draftState, operationsPath) as LargeOperation[];
      if (index > 0) {
        const tempOperation = operations[index];
        operations[index] = operations[index - 1];
        operations[index - 1] = tempOperation;
      }
    },
    moveDownOperation(draftState, action: PayloadAction<string>) {
      const path = action.payload;
      const { operationsPath, index } = getOperationsPathAndIndex(path);
      const operations = get(draftState, operationsPath) as LargeOperation[];
      if (index < operations.length - 1) {
        const tempOperation = operations[index];
        operations[index] = operations[index + 1];
        operations[index + 1] = tempOperation;
      }
    },
    updateInput(draftState, action: PayloadAction<UpdateInputActionPayload>) {
      const { path, value } = action.payload;
      updateDraftScriptEditorField(draftState, path, value);
    },
    updateInputWithVariable(draftState, action: PayloadAction<Variable>) {
      const variable = action.payload;
      const { activePath, updateMode } = draftState.variableSelector;
      const valuePath = `${activePath}.value`;
      const value = get(draftState, valuePath) as string;
      const newValue = getUpdatedInputValueWithVariable(
        value,
        updateMode,
        variable
      );
      updateDraftScriptEditorField(draftState, activePath, newValue);
    },
    showOperationSelector(draftState, action: PayloadAction<string>) {
      const path = action.payload;
      draftState.operationSelector.visible = true;
      draftState.operationSelector.activePath = path;
    },
    hideOperationSelector(draftState) {
      draftState.operationSelector.visible = false;
    },
    showVariableSelector(draftState, action: PayloadAction<string>) {
      const path = action.payload;
      const field = get(draftState, path) as LargeInput;
      if ("variablePicker" in field && field.variablePicker) {
        const { variablePicker } = field;
        draftState.variableSelector.visible = true;
        draftState.variableSelector.activePath = path;
        draftState.variableSelector.filterType = variablePicker.type;
        draftState.variableSelector.updateMode = variablePicker.mode;
      }
    },
    hideVariableSelector(draftState) {
      draftState.variableSelector.visible = false;
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
