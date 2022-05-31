import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { get } from "object-path-immutable";
import { OperationTypes } from "../../../common/constants/operation";
import {
  LargeInput,
  LargeOperation
} from "../../../common/types/largeOperation";
import { INITIAL_SCRIPT_EDITOR_STATE } from "./constants";
import {
  AppendOperationActionPayload,
  DeleteOperationActionPayload,
  MoveDownOperationActionPayload,
  MoveUpOperationActionPayload,
  ShowOperationSelectorActionPayload,
  ShowVariableSelectorActionPayload,
  UpdateInformationActionPayload,
  UpdateInputActionPayload,
  UpdateInputWithVariableActionPayload,
  UpdateStateActionPayload
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
    updateState(_, action: PayloadAction<UpdateStateActionPayload>) {
      return action.payload.state;
    },
    updateInformation(
      state,
      action: PayloadAction<UpdateInformationActionPayload>
    ) {
      const { key, value } = action.payload;
      const fieldPath = `information.${key}`;
      updateDraftScriptEditorField(state, fieldPath, value);
    },
    appendOperation(
      state,
      action: PayloadAction<AppendOperationActionPayload>
    ) {
      const { operation } = action.payload;
      const { activePath } = state.operationSelector;
      const operations = get(state, activePath) as LargeOperation[];
      operations.push(operation);
    },
    deleteOperation(
      state,
      action: PayloadAction<DeleteOperationActionPayload>
    ) {
      const { path } = action.payload;
      const { operationsPath, index } = getOperationsPathAndIndex(path);
      const operations = get(state, operationsPath) as LargeOperation[];
      const [deletedOperation] = operations.splice(index, 1);
      if (deletedOperation?.type === OperationTypes.SET) {
        const oldVariables = state.variables;
        const newVariables = oldVariables.filter((item) => item.path !== path);
        state.variables = newVariables;
      }
    },
    moveUpOperation(
      state,
      action: PayloadAction<MoveUpOperationActionPayload>
    ) {
      const { path } = action.payload;
      const { operationsPath, index } = getOperationsPathAndIndex(path);
      const operations = get(state, operationsPath) as LargeOperation[];
      if (index > 0) {
        const tempOperation = operations[index];
        operations[index] = operations[index - 1];
        operations[index - 1] = tempOperation;
      }
    },
    moveDownOperation(
      state,
      action: PayloadAction<MoveDownOperationActionPayload>
    ) {
      const { path } = action.payload;
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
    updateInputWithVariable(
      state,
      action: PayloadAction<UpdateInputWithVariableActionPayload>
    ) {
      const { variable } = action.payload;
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
    showOperationSelector(
      state,
      action: PayloadAction<ShowOperationSelectorActionPayload>
    ) {
      const { path } = action.payload;
      state.operationSelector.visible = true;
      state.operationSelector.activePath = path;
    },
    hideOperationSelector(state) {
      state.operationSelector.visible = false;
    },
    showVariableSelector(
      state,
      action: PayloadAction<ShowVariableSelectorActionPayload>
    ) {
      const { path } = action.payload;
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

export default scriptEditorSlice.reducer;
