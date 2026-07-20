import { OPERATION_SCHEMA } from "@common/constants/operationSchema";
import type { OperationType } from "@common/types/operation";
import type { Variable } from "@common/types/variable";
import { validateWithRules } from "@common/utils/operation";
import { current } from "immer";
import { nanoid } from "nanoid";
import { temporal } from "zundo";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import {
  createEditorOperation,
  type EditorState,
  getOperationIds,
  getUpdatedInputValueWithVariable,
  initialEditorState,
  type OperationListRef
} from "../utils/editorUtils";

export type {
  EditorInput,
  EditorOperation,
  EditorState,
  OperationListRef
} from "../utils/editorUtils";
export { createEditorOperation, getOperationIds } from "../utils/editorUtils";

// How long rapid edits (e.g. typing) are coalesced into a single undo step.
const HISTORY_THROTTLE_MS = 400;
const HISTORY_LIMIT = 50;

type EditorActions = {
  replaceState: (next: EditorState) => void;
  updateInformation: (payload: {
    key: "name" | "description";
    value: string;
  }) => void;
  appendOperation: (type: OperationType) => void;
  deleteOperation: (payload: { listRef: OperationListRef; id: string }) => void;
  duplicateOperation: (payload: {
    listRef: OperationListRef;
    id: string;
  }) => void;
  reorderOperation: (payload: {
    listRef: OperationListRef;
    from: number;
    to: number;
  }) => void;
  updateInput: (payload: {
    operationId: string;
    inputIndex: number;
    value: string;
  }) => void;
  updateInputWithVariable: (variable: Variable) => void;
  showOperationPicker: (ref: OperationListRef) => void;
  hideOperationPicker: () => void;
  showVariablePicker: (payload: {
    operationId: string;
    inputIndex: number;
  }) => void;
  hideVariablePicker: () => void;
  showElementPicker: (payload: {
    operationId: string;
    inputIndex: number;
  }) => void;
  hideElementPicker: () => void;
};

export type EditorStore = EditorState & { actions: EditorActions };

// Rate-limits `fn` to at most once per `ms`, running a trailing call so the
// final state in a burst is never lost. Used to coalesce undo history.
const throttle = <Args extends unknown[]>(
  fn: (...args: Args) => void,
  ms: number
) => {
  let last = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Args) => {
    const remaining = ms - (Date.now() - last);
    if (remaining <= 0) {
      last = Date.now();
      fn(...args);
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = Date.now();
        fn(...args);
      }, remaining);
    }
  };
};

// --- draft mutators (operate on the immer draft inside actions) ---

const applyInputValue = (
  state: EditorState,
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

// Keeps the variables list in sync when a "set" operation's name/type inputs
// change. Variables are owned by the operation that declares them.
const syncVariableForOperation = (
  state: EditorState,
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

// Collects an operation's id plus every descendant id (through its block
// inputs).
const collectOperationIds = (state: EditorState, id: string, acc: string[]) => {
  acc.push(id);
  for (const input of state.operations[id]?.inputs ?? []) {
    if (input.type === "block") {
      for (const childId of input.operationIds) {
        collectOperationIds(state, childId, acc);
      }
    }
  }
};

/**
 * The editor store. Undo/redo is provided by zundo's `temporal` middleware,
 * which tracks only the editable core (partialize) and coalesces rapid edits
 * (handleSet throttle); the pickers and script metadata are excluded so they
 * never create history entries. Access history via `useEditorStore.temporal`.
 */
export const useEditorStore = create<EditorStore>()(
  temporal(
    immer((set) => ({
      ...initialEditorState,
      actions: {
        replaceState: (next) =>
          set((state) => {
            Object.assign(state, next);
          }),
        updateInformation: ({ key, value }) =>
          set((state) => {
            const field = state.information[key];
            field.error = validateWithRules(value, field.rules);
            field.value = value;
          }),
        appendOperation: (type) =>
          set((state) => {
            const target = state.operationPicker.target;
            if (!target) {
              return;
            }
            const operation = createEditorOperation(type);
            state.operations[operation.id] = operation;
            getOperationIds(state, target).push(operation.id);
          }),
        deleteOperation: ({ listRef, id }) =>
          set((state) => {
            const ids = getOperationIds(state, listRef);
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
          }),
        duplicateOperation: ({ listRef, id }) =>
          set((state) => {
            const ids = getOperationIds(state, listRef);
            const index = ids.indexOf(id);
            if (index === -1) {
              return;
            }
            // Deep-clone the subtree with fresh ids, duplicating any variables
            // owned by cloned "set" operations.
            const cloneSubtree = (sourceId: string): string => {
              const source = state.operations[sourceId];
              // current() unwraps the draft to a plain snapshot; structuredClone
              // then gives a fully mutable deep copy to re-id.
              const copy = {
                ...structuredClone(current(source)),
                id: nanoid()
              };
              copy.inputs = copy.inputs.map((input) =>
                input.type === "block"
                  ? {
                      ...input,
                      operationIds: input.operationIds.map(cloneSubtree)
                    }
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
          }),
        reorderOperation: ({ listRef, from, to }) =>
          set((state) => {
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
            const [moved] = ids.splice(from, 1);
            ids.splice(to, 0, moved);
          }),
        updateInput: ({ operationId, inputIndex, value }) =>
          set((state) => {
            applyInputValue(state, operationId, inputIndex, value);
          }),
        updateInputWithVariable: (variable) =>
          set((state) => {
            const target = state.variablePicker.target;
            if (!target) {
              return;
            }
            const input =
              state.operations[target.operationId]?.inputs[target.inputIndex];
            if (!input || input.type === "block") {
              return;
            }
            const newValue = getUpdatedInputValueWithVariable(
              input.value,
              state.variablePicker.updateMode,
              variable
            );
            applyInputValue(
              state,
              target.operationId,
              target.inputIndex,
              newValue
            );
          }),
        showOperationPicker: (ref) =>
          set((state) => {
            state.operationPicker.target = ref;
          }),
        hideOperationPicker: () =>
          set((state) => {
            state.operationPicker.target = null;
          }),
        showVariablePicker: ({ operationId, inputIndex }) =>
          set((state) => {
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
          }),
        hideVariablePicker: () =>
          set((state) => {
            state.variablePicker.target = null;
          }),
        showElementPicker: ({ operationId, inputIndex }) =>
          set((state) => {
            const operation = state.operations[operationId];
            if (!operation) {
              return;
            }
            const schema = OPERATION_SCHEMA[operation.type].inputs[inputIndex];
            if (schema.type === "text" && schema.elementPicker) {
              state.elementPicker.target = { operationId, inputIndex };
            }
          }),
        hideElementPicker: () =>
          set((state) => {
            state.elementPicker.target = null;
          })
      }
    })),
    {
      limit: HISTORY_LIMIT,
      // Track only the editable core; pickers and metadata are excluded.
      partialize: ({ information, operations, rootIds, variables }) => ({
        information,
        operations,
        rootIds,
        variables
      }),
      // immer keeps unchanged slices referentially stable, so a shallow compare
      // skips no-op sets (e.g. opening a picker) from the history.
      equality: (past, next) => shallow(past, next),
      handleSet: (handleSet) => throttle(handleSet, HISTORY_THROTTLE_MS)
    }
  )
);

// --- selectors ---

export const selectInformation = (s: EditorStore) => s.information;
export const selectOperationPicker = (s: EditorStore) => s.operationPicker;
export const selectVariablePicker = (s: EditorStore) => s.variablePicker;
export const selectElementPicker = (s: EditorStore) => s.elementPicker;
export const selectVariables = (s: EditorStore) => s.variables;
export const selectActions = (s: EditorStore) => s.actions;

// URL of the first root-level "open" step, used to pre-fill the element picker
// so it targets the page the script actually scrapes.
export const selectFirstOpenUrl = (s: EditorStore): string => {
  for (const id of s.rootIds) {
    const operation = s.operations[id];
    if (operation?.type === "open") {
      const urlInput = operation.inputs[0];
      return urlInput && urlInput.type !== "block" ? urlInput.value : "";
    }
  }
  return "";
};
