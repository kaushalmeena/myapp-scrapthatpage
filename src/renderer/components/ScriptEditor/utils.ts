import { Draft, produce } from "immer";
import { chain, get, set } from "lodash";
import { LargeOperation } from "../../../common/types/largeOperation";
import { ValidationRule } from "../../../common/types/validation";
import {
  convertToLargeOperation,
  convertToSmallOperation,
  validateWithRules
} from "../../../common/utils/operation";
import { Script } from "../../types/script";
import {
  ScriptEditorState,
  initialScriptEditorState
} from "../../redux/slices/scriptEditorSlice";

export const getOperationNumber = (path: string) =>
  path
    .split(/\D+/g)
    .filter(Boolean)
    .filter((_, index) => index % 2 === 0)
    .map((num) => Number(num) + 1)
    .join(".");

export const getScriptFromScriptEditorState = (
  state: ScriptEditorState
): Script => ({
  id: state.id,
  favorite: state.favorite,
  name: state.information.name.value,
  description: state.information.description.value,
  operations: state.operations.map(convertToSmallOperation)
});

export const getScriptEditorStateFromScript = (
  script: Script
): ScriptEditorState =>
  chain(initialScriptEditorState)
    .cloneDeep()
    .set("id", script.id)
    .set("favorite", script.favorite)
    .set("information.name.value", script.name)
    .set("information.description.value", script.description)
    .set("operations", script.operations.map(convertToLargeOperation))
    .value();

const validateScriptEditorField = (
  state: Draft<ScriptEditorState>,
  path: string,
  errors: string[]
) => {
  const valuePath = `${path}.value`;
  const errorPath = `${path}.error`;
  const rulesPath = `${path}.rules`;

  const value = get(state, valuePath) as string;
  const rules = get(state, rulesPath) as ValidationRule[];
  const error = validateWithRules(value, rules);

  if (error) {
    set(state, errorPath, error);
    errors.push(error);
  }
};

const validateScriptEditorOperations = (
  state: Draft<ScriptEditorState>,
  path: string,
  errors: string[]
) => {
  const operations = get(state, path) as LargeOperation[];

  for (let i = 0; i < operations.length; i += 1) {
    const operation = operations[i];
    const operationPath = `${path}.${i}`;

    const inputErrors: string[] = [];

    for (let j = 0; j < operation.inputs.length; j += 1) {
      switch (operation.inputs[j].type) {
        case "text":
        case "select":
          {
            const inputPath = `${operationPath}.inputs.${j}`;
            validateScriptEditorField(state, inputPath, inputErrors);
          }
          break;
        case "operation_box":
          {
            const operationsPath = `${operationPath}.inputs.${j}.operations`;
            validateScriptEditorOperations(state, operationsPath, errors);
          }
          break;
      }
    }

    if (inputErrors.length > 0) {
      const operationNumber = getOperationNumber(operationPath);
      errors.push(`Please fix error in operation ${operationNumber}`);
    }
  }
};

export const validateScriptEditorState = (state: ScriptEditorState) => {
  const errors: string[] = [];

  const validatedState = produce(state, (draft) => {
    validateScriptEditorField(draft, "information.name", errors);
    validateScriptEditorField(draft, "information.description", errors);
    validateScriptEditorOperations(draft, "operations", errors);
  });

  return { errors, validatedState };
};
