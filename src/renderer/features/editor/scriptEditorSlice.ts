import {
  createSlice,
  current,
  type Draft,
  nanoid,
  type PayloadAction
} from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import type { RootState } from "@/app/store";
import type {
  FormOperation,
  FormSelectInput,
  FormTextInput
} from "../../../common/types/formOperation";
import type { StoredOperation } from "../../../common/types/storedOperation";
import type { ValidationRule } from "../../../common/types/validation";
import type {
  Variable,
  VariablePickerMode,
  VariableType
} from "../../../common/types/variable";
import { validateWithRules } from "../../../common/utils/operation";

// The editor holds operations NORMALIZED: a flat id -> operation map plus id
// lists (the root list and one per operation_box input). Components address an
// input as (operationId, inputIndex) instead of a fragile lodash path, and
// moving/deleting an operation is list surgery instead of tree surgery.

export type EditorTextInput = FormTextInput;
export type EditorSelectInput = FormSelectInput;

export type EditorBoxInput = {
  label: string;
  type: "operation_box";
  operationIds: string[];
};

export type EditorInput = EditorTextInput | EditorSelectInput | EditorBoxInput;

export type EditorOperation = {
  id: string;
  type: StoredOperation["type"];
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

// The undoable core of the editor state (everything the user edits).
export type EditorSnapshot = {
  information: {
    name: EditorField;
    description: EditorField;
  };
  operations: Record<string, EditorOperation>;
  rootIds: string[];
  variables: Variable[];
};

export type ScriptEditorState = {
  id?: number;
  version?: number;
  favorite: boolean;
  information: {
    name: EditorField;
    description: EditorField;
  };
  operations: Record<string, EditorOperation>;
  rootIds: string[];
  variables: Variable[];
  past: EditorSnapshot[];
  future: EditorSnapshot[];
  // Coalescing key so continuous typing into one field is a single undo step.
  lastEdit: string | null;
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
  favorite: false,
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
  past: [],
  future: [],
  lastEdit: null,
  operationSelector: {
    target: null
  },
  variableSelector: {
    target: null,
    filterType: "any",
    updateMode: "set"
  }
};

const HISTORY_LIMIT = 50;

const takeSnapshot = (state: Draft<ScriptEditorState>): EditorSnapshot => {
  // current() gives an immutable plain snapshot, so past entries can be
  // stored by reference without cloning.
  const snapshot = current(state);
  return {
    information: snapshot.information,
    operations: snapshot.operations,
    rootIds: snapshot.rootIds,
    variables: snapshot.variables
  };
};

const applySnapshot = (
  state: Draft<ScriptEditorState>,
  snapshot: EditorSnapshot
) => {
  state.information = snapshot.information;
  state.operations = snapshot.operations;
  state.rootIds = snapshot.rootIds;
  state.variables = snapshot.variables;
};

// Records the pre-mutation state onto the undo stack. Mutations sharing the
// same non-null editKey (e.g. keystrokes into one field) coalesce into a
// single undo step.
const commitHistory = (
  state: Draft<ScriptEditorState>,
  editKey: string | null = null
) => {
  if (editKey !== null && state.lastEdit === editKey) {
    return;
  }
  state.past.push(takeSnapshot(state));
  if (state.past.length > HISTORY_LIMIT) {
    state.past.shift();
  }
  state.future = [];
  state.lastEdit = editKey;
};

export const getListIds = (
  state: ScriptEditorState | Draft<ScriptEditorState>,
  ref: OperationListRef
): string[] => {
  if (ref.parentId === null) {
    return state.rootIds;
  }
  const input = state.operations[ref.parentId]?.inputs[ref.inputIndex ?? -1];
  if (input?.type !== "operation_box") {
    throw new Error("Operation list ref does not point at an operation_box");
  }
  return input.operationIds;
};

// Builds a fresh editor operation from an operation template
// (OPERATION_FORMS), assigning it a new id.
export const createEditorOperation = (
  template: FormOperation
): EditorOperation => ({
  id: nanoid(),
  type: template.type,
  name: template.name,
  description: template.description,
  format: template.format,
  inputs: template.inputs.map(
    (input): EditorInput =>
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
      commitHistory(state, `information:${key}`);
      const field = state.information[key];
      field.error = validateWithRules(value, field.rules);
      field.value = value;
    },
    appendOperation(state, action: PayloadAction<FormOperation>) {
      const target = state.operationSelector.target;
      if (!target) {
        return;
      }
      commitHistory(state);
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
      commitHistory(state);
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
    duplicateOperation(
      state,
      action: PayloadAction<{ listRef: OperationListRef; id: string }>
    ) {
      const { listRef, id } = action.payload;
      const ids = getListIds(state, listRef);
      const index = ids.indexOf(id);
      if (index === -1) {
        return;
      }
      commitHistory(state);
      // Deep-clone the operation subtree, assigning fresh ids throughout and
      // duplicating any variables owned by cloned "set" operations.
      const cloneSubtree = (sourceId: string): string => {
        const source = state.operations[sourceId];
        const copy: EditorOperation = {
          ...cloneDeep({ ...source }),
          id: nanoid()
        };
        copy.inputs = copy.inputs.map((input) =>
          input.type === "operation_box"
            ? { ...input, operationIds: input.operationIds.map(cloneSubtree) }
            : input
        );
        state.operations[copy.id] = copy;
        const ownedVariable = state.variables.find(
          (item) => item.ownerId === sourceId
        );
        if (ownedVariable) {
          state.variables.push({ ...ownedVariable, ownerId: copy.id });
        }
        return copy.id;
      };
      ids.splice(index + 1, 0, cloneSubtree(id));
    },
    reorderOperation(
      state,
      action: PayloadAction<{
        listRef: OperationListRef;
        from: number;
        to: number;
      }>
    ) {
      const { listRef, from, to } = action.payload;
      const ids = getListIds(state, listRef);
      if (
        from === to ||
        from < 0 ||
        to < 0 ||
        from >= ids.length ||
        to >= ids.length
      ) {
        return;
      }
      commitHistory(state);
      const [moved] = ids.splice(from, 1);
      ids.splice(to, 0, moved);
    },
    undo(state) {
      const previous = state.past.pop();
      if (!previous) {
        return;
      }
      state.future.unshift(takeSnapshot(state));
      applySnapshot(state, previous);
      state.lastEdit = null;
    },
    redo(state) {
      const next = state.future.shift();
      if (!next) {
        return;
      }
      state.past.push(takeSnapshot(state));
      applySnapshot(state, next);
      state.lastEdit = null;
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
      commitHistory(state, `input:${operationId}:${inputIndex}`);
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
      commitHistory(state);
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
  duplicateOperation,
  reorderOperation,
  undo,
  redo,
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
export const selectCanUndo = (state: RootState) =>
  state.scriptEditor.past.length > 0;
export const selectCanRedo = (state: RootState) =>
  state.scriptEditor.future.length > 0;

// URL of the first root-level "open" step, used to pre-fill the element
// picker so it targets the page the script actually scrapes.
export const selectFirstOpenUrl = (state: RootState): string => {
  const { operations, rootIds } = state.scriptEditor;
  for (const id of rootIds) {
    const operation = operations[id];
    if (operation?.type === "open") {
      const urlInput = operation.inputs[0];
      // The URL is a text input; guard the union so `value` is accessible.
      return urlInput && urlInput.type !== "operation_box"
        ? urlInput.value
        : "";
    }
  }
  return "";
};
