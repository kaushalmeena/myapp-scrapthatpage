import { produce } from "immer";
import type { Script } from "@/types/script";
import { FORM_OPERATIONS } from "../../../../common/constants/formOperations";
import type {
  DataInput,
  DataOperation
} from "../../../../common/types/dataOperation";
import { validateWithRules } from "../../../../common/utils/operation";
import {
  createEditorOperation,
  type EditorInput,
  type EditorOperation,
  initialScriptEditorState,
  type ScriptEditorState
} from "../scriptEditorSlice";

/**
 * Looks up the form template (labels, validation, layout) for an operation
 * type from the FORM_OPERATIONS catalog.
 *
 * @throws if the type has no matching template.
 */
const getOperationForm = (type: DataOperation["type"]) => {
  const form = FORM_OPERATIONS.find((item) => item.type === type);
  if (!form) {
    throw new Error(`Operation type of ${type} not found.`);
  }
  return form;
};

/**
 * Copies a stored input's data onto its editor counterpart. Inputs line up by
 * index (both built in template order), so the paired shapes always match —
 * the type guards are only there to satisfy the compiler's per-index union.
 */
const applyDataInput = (
  editorInput: EditorInput,
  dataInput: DataInput,
  addOperation: (data: DataOperation) => string
): void => {
  if (editorInput.type === "block" && dataInput.type === "block") {
    editorInput.operationIds = dataInput.steps.map(addOperation);
  } else if (editorInput.type !== "block" && dataInput.type !== "block") {
    editorInput.value = dataInput.value;
  }
};

/**
 * Builds the normalized editor state from a stored script: every operation
 * gets an id and lands in the flat `operations` map, nesting is expressed as
 * id lists, and variables are derived from "set" operations.
 */
export const normalizeScript = (script: Script): ScriptEditorState => {
  const state = structuredClone(initialScriptEditorState);

  const addOperation = (data: DataOperation): string => {
    const operation = createEditorOperation(getOperationForm(data.type));
    // Cast: forEach over a union of input tuples collapses the element type;
    // DataInput is the true union of every input shape.
    (data.inputs as DataInput[]).forEach((dataInput, index) => {
      applyDataInput(operation.inputs[index], dataInput, addOperation);
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
const toDataOperation = (
  operations: Record<string, EditorOperation>,
  id: string
): DataOperation => {
  const operation = operations[id];
  const inputs = operation.inputs.map((input) =>
    input.type === "block"
      ? {
          type: "block" as const,
          steps: input.operationIds.map((childId) =>
            toDataOperation(operations, childId)
          )
        }
      : { type: input.type, value: input.value }
  );
  // Inputs are rebuilt in template order, so the per-type tuple shape holds by
  // construction (and is re-checked by the zod schema on write).
  return { type: operation.type, inputs } as DataOperation;
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
  operations: state.rootIds.map((id) => toDataOperation(state.operations, id))
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
      let hasError = false;
      for (const input of operation.inputs) {
        if (input.type === "block") {
          continue;
        }
        input.error = validateWithRules(input.value, input.rules);
        if (input.error) {
          hasError = true;
        }
      }
      if (hasError) {
        errors.push(`Please fix error in operation ${numbers[id]}`);
      }
    }
  });

  return { errors, validatedState };
};
