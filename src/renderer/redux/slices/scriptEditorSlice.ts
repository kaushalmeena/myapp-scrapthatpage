import { Draft, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import {
  LargeInput,
  LargeOperation,
  LargeTextInput
} from "../../../common/types/largeOperation";
import { StoreRootState } from "../../types/store";
import { ValidationRule } from "../../../common/types/validation";
import {
  Variable,
  VariableType,
  VariablePickerMode,
  VariableSetterMode
} from "../../../common/types/variable";
import { validateWithRules } from "../../../common/utils/operation";

export type ScriptEditorState = {
  id?: number;
  favorite: number;
  information: {
    name: {
      value: string;
      error: string;
      rules: ValidationRule[];
    };
    description: {
      value: string;
      error: string;
      rules: ValidationRule[];
    };
  };
  operations: LargeOperation[];
  variables: Variable[];
  variableSelector: {
    visible: boolean;
    activePath: string;
    filterType: VariableType;
    updateMode: VariablePickerMode;
  };
  operationSelector: {
    visible: boolean;
    activePath: string;
  };
};

export const initialScriptEditorState: ScriptEditorState = {
  favorite: 0,
  information: {
    name: {
      value: "",
      error: "",
      rules: [
        {
          type: "required",
          message: "Please enter name."
        }
      ]
    },
    description: {
      value: "",
      error: "",
      rules: [
        {
          type: "required",
          message: "Please enter description."
        }
      ]
    }
  },
  operations: [],
  variables: [],
  operationSelector: {
    visible: false,
    activePath: ""
  },
  variableSelector: {
    visible: false,
    activePath: "",
    filterType: "any",
    updateMode: "set"
  }
};

export const getOperationsPathInfo = (path: string) => {
  const splittedPath = path.split(".");
  const operationsPath = splittedPath.slice(0, -1).join(".");
  const index = Number.parseInt(splittedPath.at(-1) || "NaN", 10);
  return { operationsPath, index };
};

export const getUpdatedInputValueWithVariable = (
  value: string,
  mode: VariablePickerMode,
  variable: Variable
): string => {
  switch (mode) {
    case "set":
      return variable.name;
    case "append":
      return `${value}{{${variable.name}}}`;
  }
};

export const updateScriptEditorVariables = (
  state: Draft<ScriptEditorState>,
  path: string,
  value: string,
  mode: VariableSetterMode
) => {
  const foundIdx = state.variables.findIndex((item) => item.path === path);

  switch (mode) {
    case "name":
      if (foundIdx > -1) {
        state.variables[foundIdx].name = value;
      } else {
        state.variables.push({
          path,
          name: value,
          type: "number"
        });
      }
      break;
    case "type":
      if (foundIdx > -1) {
        state.variables[foundIdx].type = value;
      }
      break;
  }
};

export const updateScriptEditorField = (
  state: Draft<ScriptEditorState>,
  path: string,
  value: string
) => {
  const field = get(state, path) as LargeTextInput;
  field.error = validateWithRules(value, field.rules);
  field.value = value;

  if (field.variableSetter) {
    const operationPath = path.split(".").slice(0, -2).join(".");
    updateScriptEditorVariables(
      state,
      operationPath,
      value,
      field.variableSetter.mode
    );
  }
};

const scriptEditorSlice = createSlice({
  name: "scriptEditor",
  initialState: initialScriptEditorState,
  reducers: {
    updateState(_, action: PayloadAction<ScriptEditorState>) {
      const state = action.payload;
      return state;
    },
    updateInformation(
      state,
      action: PayloadAction<{
        key: string;
        value: string;
      }>
    ) {
      const { key, value } = action.payload;
      const fieldPath = `information.${key}`;
      updateScriptEditorField(state, fieldPath, value);
    },
    appendOperation(state, action: PayloadAction<LargeOperation>) {
      const operation = action.payload;
      const { activePath } = state.operationSelector;
      const operations = get(state, activePath) as LargeOperation[];
      operations.push(operation);
    },
    deleteOperation(state, action: PayloadAction<string>) {
      const path = action.payload;
      const { operationsPath, index } = getOperationsPathInfo(path);
      const operations = get(state, operationsPath) as LargeOperation[];
      const [deletedOperation] = operations.splice(index, 1);
      if (deletedOperation?.type === "set") {
        const oldVariables = state.variables;
        const newVariables = oldVariables.filter((item) => item.path !== path);
        state.variables = newVariables;
      }
    },
    moveUpOperation(state, action: PayloadAction<string>) {
      const path = action.payload;
      const { operationsPath, index } = getOperationsPathInfo(path);
      const operations = get(state, operationsPath) as LargeOperation[];
      if (index > 0) {
        const temp = operations[index];
        operations[index] = operations[index - 1];
        operations[index - 1] = temp;
      }
    },
    moveDownOperation(state, action: PayloadAction<string>) {
      const path = action.payload;
      const { operationsPath, index } = getOperationsPathInfo(path);
      const operations = get(state, operationsPath) as LargeOperation[];
      if (index < operations.length - 1) {
        const temp = operations[index];
        operations[index] = operations[index + 1];
        operations[index + 1] = temp;
      }
    },
    updateInput(
      state,
      action: PayloadAction<{
        path: string;
        value: string;
      }>
    ) {
      const { path, value } = action.payload;
      updateScriptEditorField(state, path, value);
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
      updateScriptEditorField(state, activePath, newValue);
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
        state.variableSelector.visible = true;
        state.variableSelector.activePath = path;
        state.variableSelector.filterType = field.variablePicker.type;
        state.variableSelector.updateMode = field.variablePicker.mode;
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

export const scriptEditorReducer = scriptEditorSlice.reducer;

export const selectInformation = (state: StoreRootState) =>
  state.scriptEditor.information;
export const selectOperationSelector = (state: StoreRootState) =>
  state.scriptEditor.operationSelector;
export const selectVariableSelector = (state: StoreRootState) =>
  state.scriptEditor.variableSelector;
export const selectVariables = (state: StoreRootState) =>
  state.scriptEditor.variables;
