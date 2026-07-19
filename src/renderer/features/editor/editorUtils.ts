import { produce } from "immer";
import { cloneDeep } from "lodash";
import type { Script } from "@/types/script";
import { LARGE_OPERATIONS } from "../../../common/constants/largeOperations";
import type {
  SmallInput,
  SmallOperation
} from "../../../common/types/smallOperation";
import { validateWithRules } from "../../../common/utils/operation";
import {
  createEditorOperation,
  initialScriptEditorState,
  type ScriptEditorState
} from "./scriptEditorSlice";

const getOperationTemplate = (type: SmallOperation["type"]) => {
  const template = LARGE_OPERATIONS.find((item) => item.type === type);
  if (!template) {
    throw new Error(`Operation type of ${type} not found.`);
  }
  return template;
};

// Builds the normalized editor state from a stored script: every operation
// gets an id and lands in the flat map, nesting becomes id lists, and
// variables are derived from "set" operations.
export const normalizeScript = (script: Script): ScriptEditorState => {
  const state = cloneDeep(initialScriptEditorState);

  const addOperation = (small: SmallOperation): string => {
    const operation = createEditorOperation(getOperationTemplate(small.type));
    // Cast: calling forEach on a union of tuple types collapses the element
    // type; SmallInput is the true union of all input shapes.
    (small.inputs as SmallInput[]).forEach((smallInput, index) => {
      const editorInput = operation.inputs[index];
      if (smallInput.type === "operation_box") {
        if (editorInput.type === "operation_box") {
          editorInput.operationIds = smallInput.operations.map(addOperation);
        }
      } else if (editorInput.type !== "operation_box") {
        editorInput.value = smallInput.value;
      }
    });
    if (small.type === "set") {
      state.variables.push({
        ownerId: operation.id,
        name: small.inputs[0].value,
        type: small.inputs[1].value
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

// Converts the normalized editor state back into the compact stored form.
export const denormalizeState = (state: ScriptEditorState): Script => {
  const toSmall = (id: string): SmallOperation => {
    const operation = state.operations[id];
    const inputs = operation.inputs.map((input) =>
      input.type === "operation_box"
        ? {
            type: "operation_box" as const,
            operations: input.operationIds.map(toSmall)
          }
        : { type: input.type, value: input.value }
    );
    // The inputs are rebuilt in template order, so the tuple shape per
    // operation type is guaranteed by construction (and re-checked by the
    // zod schema when the script is written to the database).
    return { type: operation.type, inputs } as SmallOperation;
  };

  return {
    id: state.id,
    version: state.version,
    favorite: state.favorite,
    name: state.information.name.value,
    description: state.information.description.value,
    operations: state.rootIds.map(toSmall)
  };
};

// Computes the display number ("2.3" = third child of the second root
// operation) for every operation in tree order.
export const computeOperationNumbers = (
  state: Pick<ScriptEditorState, "operations" | "rootIds">
): Record<string, string> => {
  const numbers: Record<string, string> = {};

  const walk = (ids: string[], prefix: string) => {
    ids.forEach((id, index) => {
      const number = prefix ? `${prefix}.${index + 1}` : `${index + 1}`;
      numbers[id] = number;
      for (const input of state.operations[id]?.inputs ?? []) {
        if (input.type === "operation_box") {
          walk(input.operationIds, number);
        }
      }
    });
  };

  walk(state.rootIds, "");
  return numbers;
};

// Validates the whole editor state, returning the error messages plus a copy
// of the state with per-field error strings filled in.
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

    // Tree order keeps error messages in the order the user sees the cards.
    const orderedIds = Object.keys(numbers).sort((a, b) =>
      numbers[a].localeCompare(numbers[b], undefined, { numeric: true })
    );
    for (const id of orderedIds) {
      const operation = draft.operations[id];
      let hasError = false;
      for (const input of operation.inputs) {
        if (input.type === "operation_box") {
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
