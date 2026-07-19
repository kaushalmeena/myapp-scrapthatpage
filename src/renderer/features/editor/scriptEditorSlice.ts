import { OPERATION_SCHEMA } from "@common/constants/operationSchema";
import type { OperationType } from "@common/types/operation";
import type { ValidationRule } from "@common/types/validation";
import type {
  Variable,
  VariablePickerMode,
  VariableType
} from "@common/types/variable";
import { validateWithRules } from "@common/utils/operation";
import {
  createSlice,
  current,
  type Draft,
  nanoid,
  type PayloadAction
} from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

/**
 * The editor holds operations NORMALIZED: a flat id -> operation map plus id
 * lists (the root list and one per block input). Components address an
 * input as (operationId, inputIndex) instead of a fragile nested path, and
 * moving/deleting an operation is list surgery instead of tree surgery.
 *
 * Each node is as thin as the stored Operation: just the type and per-input
 * value/error (blocks hold child ids). All static metadata — labels, layout,
 * validation rules, picker config — is looked up from OPERATION_SCHEMA by type.
 */

// A value-carrying input (text or select). `error` is transient display state.
export type EditorScalarInput = {
  type: "text" | "select";
  value: string;
  error: string;
};

export type EditorBlockInput = {
  type: "block";
  operationIds: string[];
};

export type EditorInput = EditorScalarInput | EditorBlockInput;

export type EditorOperation = {
  id: string;
  type: OperationType;
  inputs: EditorInput[];
};

// Identifies one operation list: the root list (parentId null) or a
// block input of a parent operation.
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
  operationPicker: {
    target: OperationListRef | null;
  };
  variablePicker: {
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
  operationPicker: {
    target: null
  },
  variablePicker: {
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

export const getOperationIds = (
  state: ScriptEditorState | Draft<ScriptEditorState>,
  ref: OperationListRef
): string[] => {
  if (ref.parentId === null) {
    return state.rootIds;
  }
  const input = state.operations[ref.parentId]?.inputs[ref.inputIndex ?? -1];
  if (input?.type !== "block") {
    throw new Error("Operation list ref does not point at a block");
  }
  return input.operationIds;
};

// Builds a fresh editor operation of the given type, seeding each input with
// its schema default and assigning a new id.
export const createEditorOperation = (
  type: OperationType
): EditorOperation => ({
  id: nanoid(),
  type,
  inputs: OPERATION_SCHEMA[type].inputs.map(
    (input): EditorInput =>
      input.type === "block"
        ? { type: "block", operationIds: [] }
        : { type: input.type, value: input.defaultValue, error: "" }
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
  if (!operation || !input || input.type === "block") {
    return;
  }
  const schema = OPERATION_SCHEMA[operation.type].inputs[inputIndex];
  if (schema.type === "block") {
    return;
  }
  input.error = validateWithRules(value, schema.rules);
  input.value = value;
  if (schema.variableSetter) {
    syncVariableForOperation(
      state,
      operationId,
      schema.variableSetter.mode,
      value
    );
  }
};

// Collects an operation's id plus every descendant id (through its block
// inputs).
const collectOperationIds = (
  state: Draft<ScriptEditorState>,
  id: string,
  acc: string[]
) => {
  acc.push(id);
  for (const input of state.operations[id]?.inputs ?? []) {
    if (input.type === "block") {
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
    appendOperation(state, action: PayloadAction<OperationType>) {
      const target = state.operationPicker.target;
      if (!target) {
        return;
      }
      commitHistory(state);
      const operation = createEditorOperation(action.payload);
      state.operations[operation.id] = operation;
      getOperationIds(state, target).push(operation.id);
    },
    deleteOperation(
      state,
      action: PayloadAction<{ listRef: OperationListRef; id: string }>
    ) {
      const { listRef, id } = action.payload;
      const ids = getOperationIds(state, listRef);
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
      const ids = getOperationIds(state, listRef);
      const index = ids.indexOf(id);
      if (index === -1) {
        return;
      }
      commitHistory(state);
      // Deep-clone the operation subtree, assigning fresh ids throughout and
      // duplicating any variables owned by cloned "set" operations.
      const cloneSubtree = (sourceId: string): string => {
        const source = state.operations[sourceId];
        // current() unwraps the immer draft to a plain snapshot;
        // structuredClone then gives a fully mutable deep copy to re-id.
        const copy: EditorOperation = {
          ...structuredClone(current(source)),
          id: nanoid()
        };
        copy.inputs = copy.inputs.map((input) =>
          input.type === "block"
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
      const ids = getOperationIds(state, listRef);
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
      const target = state.variablePicker.target;
      if (!target) {
        return;
      }
      const input =
        state.operations[target.operationId]?.inputs[target.inputIndex];
      if (!input || input.type === "block") {
        return;
      }
      commitHistory(state);
      const newValue = getUpdatedInputValueWithVariable(
        input.value,
        state.variablePicker.updateMode,
        action.payload
      );
      applyInputValue(state, target.operationId, target.inputIndex, newValue);
    },
    showOperationPicker(state, action: PayloadAction<OperationListRef>) {
      state.operationPicker.target = action.payload;
    },
    hideOperationPicker(state) {
      state.operationPicker.target = null;
    },
    showVariablePicker(
      state,
      action: PayloadAction<{ operationId: string; inputIndex: number }>
    ) {
      const { operationId, inputIndex } = action.payload;
      const operation = state.operations[operationId];
      if (!operation) {
        return;
      }
      const schema = OPERATION_SCHEMA[operation.type].inputs[inputIndex];
      if (schema.type === "text" && schema.variablePicker) {
        state.variablePicker.target = { operationId, inputIndex };
        state.variablePicker.filterType = schema.variablePicker.type;
        state.variablePicker.updateMode = schema.variablePicker.mode;
      }
    },
    hideVariablePicker(state) {
      state.variablePicker.target = null;
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
  showOperationPicker,
  hideOperationPicker,
  showVariablePicker,
  hideVariablePicker
} = scriptEditorSlice.actions;

export const scriptEditorReducer = scriptEditorSlice.reducer;

export const selectInformation = (state: RootState) =>
  state.scriptEditor.information;
export const selectOperationPicker = (state: RootState) =>
  state.scriptEditor.operationPicker;
export const selectVariablePicker = (state: RootState) =>
  state.scriptEditor.variablePicker;
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
      return urlInput && urlInput.type !== "block" ? urlInput.value : "";
    }
  }
  return "";
};
