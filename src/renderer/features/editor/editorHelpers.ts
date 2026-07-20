import { OPERATION_SCHEMA } from "@common/constants/operationSchema";
import type { OperationType } from "@common/types/operation";
import type { ValidationRule } from "@common/types/validation";
import type {
  Variable,
  VariablePickerMode,
  VariableType
} from "@common/types/variable";
import { nanoid } from "nanoid";

/**
 * Types and pure helpers for the editor store. Kept store-free so the store
 * (editorStore.ts) and the pure transforms (utils/editorUtils.ts) can both
 * import them without a cycle.
 *
 * The editor holds operations NORMALIZED: a flat id -> operation map plus id
 * lists (the root list and one per block input). Each node is as thin as the
 * stored Operation; all static metadata is looked up from OPERATION_SCHEMA.
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

// Identifies one operation list: the root list (parentId null) or a block
// input of a parent operation.
export type OperationListRef = {
  parentId: string | null;
  inputIndex?: number;
};

export type EditorField = {
  value: string;
  error: string;
  rules: ValidationRule[];
};

export type EditorState = {
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
  operationPicker: {
    target: OperationListRef | null;
  };
  variablePicker: {
    target: { operationId: string; inputIndex: number } | null;
    filterType: VariableType;
    updateMode: VariablePickerMode;
  };
  elementPicker: {
    target: { operationId: string; inputIndex: number } | null;
  };
};

export const initialEditorState: EditorState = {
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
  operationPicker: {
    target: null
  },
  variablePicker: {
    target: null,
    filterType: "any",
    updateMode: "set"
  },
  elementPicker: {
    target: null
  }
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

// Resolves an operation-list ref to its id array: the root list, or a block
// input's children. Accepts store state or an immer draft (reads/mutates the
// same array either way).
export const getOperationIds = (
  state: Pick<EditorState, "operations" | "rootIds">,
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
