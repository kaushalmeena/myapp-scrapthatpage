import { createSlice, Draft, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import type { RootState } from "@/app/store";
import {
  LargeOperation,
  LargeSelectInput,
  LargeTextInput
} from "../../../common/types/largeOperation";
import { SmallOperation } from "../../../common/types/smallOperation";
import {
  Variable,
  VariablePickerMode,
  VariableType
} from "../../../common/types/variable";
import { ValidationRule } from "../../../common/types/validation";
import { validateWithRules } from "../../../common/utils/operation";

// The editor holds operations NORMALIZED: a flat id -> operation map plus id
// lists (the root list and one per operation_box input). Components address an
// input as (operationId, inputIndex) instead of a fragile lodash path, and
// moving/deleting an operation is list surgery instead of tree surgery.

export type EditorTextInput = LargeTextInput;
export type EditorSelectInput = LargeSelectInput;

export type EditorBoxInput = {
  label: string;
  type: "operation_box";
  operationIds: string[];
};

export type EditorInput = EditorTextInput | EditorSelectInput | EditorBoxInput;

export type EditorOperation = {
  id: string;
  type: SmallOperation["type"];
  name: string;
  description: string;
  format: string;
  inputs: EditorInput[];
};

// Identifies one operation list: the root list (parentId null) or an
// operation_box input of a parent operation.
export type OperationListRef = {
  parentId: string | null;
  inputIndex?: number;
};

export type EditorField = {
  value: string;
  error: string;
  rules: ValidationRule[];
};

export type ScriptEditorState = {
  id?: number;
  version?: number;
  favorite: number;
  information: {
    name: EditorField;
    description: EditorField;
  };
  operations: Record<string, EditorOperation>;
  rootIds: string[];
  variables: Variable[];
  operationSelector: {
    target: OperationListRef | null;
  };
  variableSelector: {
    target: { operationId: string; inputIndex: number } | null;
    filterType: VariableType;
    updateMode: VariablePickerMode;
  };
};

export const initialScriptEditorState: ScriptEditorState = {
  favorite: 0,
  information: {
    name: {
      value: "",
      error: "",
      rules: [{ type: "required", message: "Please enter name." }]
    },
    description: {
      value: "",
      error: "",
      rules: [{ type: "required", message: "Please enter description." }]
    }
  },
  operations: {},
  rootIds: [],
  variables: [],
  operationSelector: {
    target: null
  },
  variableSelector: {
    target: null,
    filterType: "any",
    updateMode: "set"
  }
};

export const getListIds = (
  state: ScriptEditorState | Draft<ScriptEditorState>,
  ref: OperationListRef
): string[] => {
  if (ref.parentId === null) {
    return state.rootIds;
  }
  const input = state.operations[ref.parentId]?.inputs[ref.inputIndex ?? -1];
  if (!input || input.type !== "operation_box") {
    throw new Error("Operation list ref does not point at an operation_box");
  }
  return input.operationIds;
};

// Builds a fresh editor operation from an operation template
// (LARGE_OPERATIONS), assigning it a new id.
export const createEditorOperation = (
  template: LargeOperation
): EditorOperation => ({
  id: nanoid(),
  type: template.type,
  name: template.name,
  description: template.description,
  format: template.format,
  inputs: template.inputs.map((input): EditorInput =>
    input.type === "operation_box"
      ? {
          label: input.label,
          type: "operation_box",
          operationIds: [] as string[]
        }
      : cloneDeep(input)
  )
});

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

// Keeps the variables list in sync when a "set" operation's name/type inputs
// change. Variables are owned by the operation that declares them.
const syncVariableForOperation = (
  state: Draft<ScriptEditorState>,
  ownerId: string,
  mode: "name" | "type",
  value: string
) => {
  const existing = state.variables.find((item) => item.ownerId === ownerId);
  if (mode === "name") {
    if (existing) {
      existing.name = value;
    } else {
      state.variables.push({ ownerId, name: value, type: "number" });
    }
  } else if (existing) {
    existing.type = value;
  }
};

const applyInputValue = (
  state: Draft<ScriptEditorState>,
  operationId: string,
  inputIndex: number,
  value: string
) => {
  const operation = state.operations[operationId];
  const input = operation?.inputs[inputIndex];
  if (!input || input.type === "operation_box") {
    return;
  }
  input.error = validateWithRules(value, input.rules);
  input.value = value;
  if ("variableSetter" in input && input.variableSetter) {
    syncVariableForOperation(
      state,
      operationId,
      input.variableSetter.mode,
      value
    );
  }
};

// Collects an operation's id plus every descendant id (through its
// operation_box inputs).
const collectOperationIds = (
  state: Draft<ScriptEditorState>,
  id: string,
  acc: string[]
) => {
  acc.push(id);
  for (const input of state.operations[id]?.inputs ?? []) {
    if (input.type === "operation_box") {
      for (const childId of input.operationIds) {
        collectOperationIds(state, childId, acc);
      }
    }
  }
};

const scriptEditorSlice = createSlice({
  name: "scriptEditor",
  initialState: initialScriptEditorState,
  reducers: {
    replaceState(_, action: PayloadAction<ScriptEditorState>) {
      return action.payload;
    },
    updateInformation(
      state,
      action: PayloadAction<{ key: "name" | "description"; value: string }>
    ) {
      const { key, value } = action.payload;
      const field = state.information[key];
      field.error = validateWithRules(value, field.rules);
      field.value = value;
    },
    appendOperation(state, action: PayloadAction<LargeOperation>) {
      const target = state.operationSelector.target;
      if (!target) {
        return;
      }
      const operation = createEditorOperation(action.payload);
      state.operations[operation.id] = operation;
      getListIds(state, target).push(operation.id);
    },
    deleteOperation(
      state,
      action: PayloadAction<{ listRef: OperationListRef; id: string }>
    ) {
      const { listRef, id } = action.payload;
      const ids = getListIds(state, listRef);
      const index = ids.indexOf(id);
      if (index === -1) {
        return;
      }
      ids.splice(index, 1);
      const removedIds: string[] = [];
      collectOperationIds(state, id, removedIds);
      for (const removedId of removedIds) {
        delete state.operations[removedId];
      }
      state.variables = state.variables.filter(
        (item) => !removedIds.includes(item.ownerId)
      );
    },
    moveOperation(
      state,
      action: PayloadAction<{
        listRef: OperationListRef;
        index: number;
        direction: "up" | "down";
      }>
    ) {
      const { listRef, index, direction } = action.payload;
      const ids = getListIds(state, listRef);
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= ids.length) {
        return;
      }
      [ids[index], ids[targetIndex]] = [ids[targetIndex], ids[index]];
    },
    updateInput(
      state,
      action: PayloadAction<{
        operationId: string;
        inputIndex: number;
        value: string;
      }>
    ) {
      const { operationId, inputIndex, value } = action.payload;
      applyInputValue(state, operationId, inputIndex, value);
    },
    updateInputWithVariable(state, action: PayloadAction<Variable>) {
      const target = state.variableSelector.target;
      if (!target) {
        return;
      }
      const input =
        state.operations[target.operationId]?.inputs[target.inputIndex];
      if (!input || input.type === "operation_box") {
        return;
      }
      const newValue = getUpdatedInputValueWithVariable(
        input.value,
        state.variableSelector.updateMode,
        action.payload
      );
      applyInputValue(state, target.operationId, target.inputIndex, newValue);
    },
    showOperationSelector(state, action: PayloadAction<OperationListRef>) {
      state.operationSelector.target = action.payload;
    },
    hideOperationSelector(state) {
      state.operationSelector.target = null;
    },
    showVariableSelector(
      state,
      action: PayloadAction<{ operationId: string; inputIndex: number }>
    ) {
      const { operationId, inputIndex } = action.payload;
      const input = state.operations[operationId]?.inputs[inputIndex];
      if (input && "variablePicker" in input && input.variablePicker) {
        state.variableSelector.target = { operationId, inputIndex };
        state.variableSelector.filterType = input.variablePicker.type;
        state.variableSelector.updateMode = input.variablePicker.mode;
      }
    },
    hideVariableSelector(state) {
      state.variableSelector.target = null;
    }
  }
});

export const {
  replaceState,
  updateInformation,
  appendOperation,
  deleteOperation,
  moveOperation,
  updateInput,
  updateInputWithVariable,
  showOperationSelector,
  hideOperationSelector,
  showVariableSelector,
  hideVariableSelector
} = scriptEditorSlice.actions;

export const scriptEditorReducer = scriptEditorSlice.reducer;

export const selectInformation = (state: RootState) =>
  state.scriptEditor.information;
export const selectOperationSelector = (state: RootState) =>
  state.scriptEditor.operationSelector;
export const selectVariableSelector = (state: RootState) =>
  state.scriptEditor.variableSelector;
export const selectVariables = (state: RootState) =>
  state.scriptEditor.variables;
