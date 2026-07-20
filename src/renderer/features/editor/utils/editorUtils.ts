import { OPERATION_SCHEMA } from "@common/constants/operationSchema";
import type { Input, Operation, OperationType } from "@common/types/operation";
import type { ValidationRule } from "@common/types/validation";
import type {
  Variable,
  VariablePickerMode,
  VariableType
} from "@common/types/variable";
import { validateWithRules } from "@common/utils/operation";
import { produce } from "immer";
import { nanoid } from "nanoid";
import type { Script } from "@/types/script";

/**
 * Editor state types, pure helpers, and the script <-> editor transforms.
 *
 * The editor holds operations NORMALIZED: a flat id -> operation map plus id
 * lists (the root list and one per block input). Each node is as thin as the
 * stored Operation; all static metadata is looked up from OPERATION_SCHEMA.
 * Kept store-free so the store (store/editorStore.ts) and these transforms can
 * import them without a cycle.
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

/**
 * Copies a stored input's data onto its editor counterpart. Inputs line up by
 * index (both built in template order), so the paired shapes always match —
 * the type guards are only there to satisfy the compiler's per-index union.
 */
const applyInput = (
  editorInput: EditorInput,
  input: Input,
  addOperation: (operation: Operation) => string
): void => {
  if (editorInput.type === "block" && input.type === "block") {
    editorInput.operationIds = input.steps.map(addOperation);
  } else if (editorInput.type !== "block" && input.type !== "block") {
    editorInput.value = input.value;
  }
};

/**
 * Builds the normalized editor state from a stored script: every operation
 * gets an id and lands in the flat `operations` map, nesting is expressed as
 * id lists, and variables are derived from "set" operations.
 */
export const normalizeScript = (script: Script): EditorState => {
  const state = structuredClone(initialEditorState);

  const addOperation = (data: Operation): string => {
    const operation = createEditorOperation(data.type);
    // Cast: forEach over a union of input tuples collapses the element type;
    // Input is the true union of every input shape.
    (data.inputs as Input[]).forEach((input, index) => {
      applyInput(operation.inputs[index], input, addOperation);
    });
    if (data.type === "set") {
      state.variables.push({
        ownerId: operation.id,
        name: data.inputs[0].value,
        type: data.inputs[1].value
      });
    }
    state.operations[operation.id] = operation;
    return operation.id;
  };

  state.id = script.id;
  state.version = script.version;
  state.favorite = script.favorite;
  state.information.name.value = script.name;
  state.information.description.value = script.description;
  state.rootIds = script.operations.map(addOperation);

  return state;
};

/**
 * Serializes one editor operation (and its descendants) into the compact
 * stored form.
 */
const toOperation = (
  operations: Record<string, EditorOperation>,
  id: string
): Operation => {
  const operation = operations[id];
  const inputs = operation.inputs.map((input) =>
    input.type === "block"
      ? {
          type: "block" as const,
          steps: input.operationIds.map((childId) =>
            toOperation(operations, childId)
          )
        }
      : { type: input.type, value: input.value }
  );
  // Inputs are rebuilt in template order, so the per-type tuple shape holds by
  // construction (and is re-checked by the zod schema on write).
  return { type: operation.type, inputs } as Operation;
};

/**
 * Converts the normalized editor state back into a storable script.
 */
export const denormalizeState = (state: EditorState): Script => ({
  id: state.id,
  version: state.version,
  favorite: state.favorite,
  name: state.information.name.value,
  description: state.information.description.value,
  operations: state.rootIds.map((id) => toOperation(state.operations, id))
});

/**
 * Computes each operation's display number in tree order — e.g. "2.3" is the
 * third child of the second root operation.
 *
 * @returns a map of operation id to its display number.
 */
export const computeOperationNumbers = (
  state: Pick<EditorState, "operations" | "rootIds">
): Record<string, string> => {
  const numbers: Record<string, string> = {};

  const walk = (ids: string[], prefix: string) => {
    ids.forEach((id, index) => {
      const number = prefix ? `${prefix}.${index + 1}` : `${index + 1}`;
      numbers[id] = number;
      for (const input of state.operations[id]?.inputs ?? []) {
        if (input.type === "block") {
          walk(input.operationIds, number);
        }
      }
    });
  };

  walk(state.rootIds, "");

  return numbers;
};

/**
 * Validates the whole editor state.
 *
 * @returns the collected error messages (in the order the user sees the
 *   fields/cards) plus a copy of the state with per-field error strings filled
 *   in for display.
 */
export const validateEditorState = (state: EditorState) => {
  const errors: string[] = [];
  const numbers = computeOperationNumbers(state);

  const validatedState = produce(state, (draft) => {
    for (const key of ["name", "description"] as const) {
      const field = draft.information[key];
      field.error = validateWithRules(field.value, field.rules);
      if (field.error) {
        errors.push(field.error);
      }
    }

    // Tree order keeps error messages aligned with how the cards are shown.
    const orderedIds = Object.keys(numbers).sort((a, b) =>
      numbers[a].localeCompare(numbers[b], undefined, { numeric: true })
    );

    for (const id of orderedIds) {
      const operation = draft.operations[id];
      const schema = OPERATION_SCHEMA[operation.type];
      let hasError = false;
      operation.inputs.forEach((input, index) => {
        if (input.type === "block") {
          return;
        }
        const inputSchema = schema.inputs[index];
        if (inputSchema.type === "block") {
          return;
        }
        input.error = validateWithRules(input.value, inputSchema.rules);
        if (input.error) {
          hasError = true;
        }
      });
      if (hasError) {
        errors.push(`Please fix error in operation ${numbers[id]}`);
      }
    }
  });

  return { errors, validatedState };
};
