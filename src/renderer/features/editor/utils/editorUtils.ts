import { OPERATION_SCHEMA } from "@common/constants/operationSchema";
import type { Input, Operation } from "@common/types/operation";
import { validateWithRules } from "@common/utils/operation";
import { produce } from "immer";
import type { Script } from "@/types/script";
import {
  createEditorOperation,
  type EditorInput,
  type EditorOperation,
  initialScriptEditorState,
  type ScriptEditorState
} from "../scriptEditorSlice";

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
export const normalizeScript = (script: Script): ScriptEditorState => {
  const state = structuredClone(initialScriptEditorState);

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
export const denormalizeState = (state: ScriptEditorState): Script => ({
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
  state: Pick<ScriptEditorState, "operations" | "rootIds">
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
export const validateEditorState = (state: ScriptEditorState) => {
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
