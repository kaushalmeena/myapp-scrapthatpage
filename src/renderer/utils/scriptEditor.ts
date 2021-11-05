import { get, set, wrap } from "object-path-immutable";
import { INPUT_TYPES } from "../../common/constants/input";
import {
  convertToLargeOperation,
  convertToSmallOperation,
  validateInput
} from "../../common/utils/operation";
import { INITIAL_SCRIPT_EDITOR_STATE } from "../constants/scriptEditor";
import { Script } from "../types/script";
import { ScriptEditorState } from "../types/scriptEditor";

export const getOperationsPathAndIndex = (
  path: string
): {
  operationsPath: string;
  index: number;
} => {
  const lastIndex = path.lastIndexOf(".");
  const operationsPath = path.substr(0, lastIndex);
  const index = Number.parseInt(path.substr(lastIndex + 1, 1));
  return { operationsPath, index };
};

export const getOperationNumber = (path: string): string =>
  path
    .split(/\D+/g)
    .filter(Boolean)
    .map((num) => Number(num) + 1)
    .join(".");

export const updateScriptEditorField = (
  state: ScriptEditorState,
  path: string,
  value: string
): ScriptEditorState => {
  const valuePath = `${path}.value`;
  const errorPath = `${path}.error`;
  const rulesPath = `${path}.rules`;
  const rules = get(state, rulesPath);
  const error = validateInput(value, rules);
  return wrap(state).set(valuePath, value).set(errorPath, error).value();
};

export const swapScriptEditorOperations = (
  state: ScriptEditorState,
  path1: string,
  path2: string
): ScriptEditorState => {
  const operation1 = get(state, path1);
  const operation2 = get(state, path2);
  return wrap(state).set(path1, operation2).set(path2, operation1).value();
};

export const getScriptFromScriptEditorState = (
  state: ScriptEditorState
): Script => {
  return {
    id: state.id,
    favorite: state.favorite,
    name: state.information.name.value,
    description: state.information.description.value,
    operations: state.operations.map(convertToSmallOperation)
  };
};

export const getScriptEditorStateFromScript = (
  script: Script
): ScriptEditorState => {
  return wrap(INITIAL_SCRIPT_EDITOR_STATE)
    .set("id", script.id)
    .set("favorite", script.favorite)
    .set("information.name.value", script.name)
    .set("information.description.value", script.description)
    .set("operations", script.operations.map(convertToLargeOperation))
    .value();
};

const validateScriptEditorOperations = (
  state: ScriptEditorState,
  path: string,
  errors: string[]
) => {
  state.operations.forEach((operation, operationIndex) => {
    const inputErrors: string[] = [];
    const operationPath = `${path}.${operationIndex}`;
    operation.inputs.forEach((input, inputIndex) => {
      const inputPath = `${operationPath}.inputs.${inputIndex}`;
      switch (input.type) {
        case INPUT_TYPES.TEXT:
          state = validateScriptEditorField(state, inputPath, inputErrors);
          break;
        case INPUT_TYPES.OPERATION_BOX:
          state = validateScriptEditorOperations(
            state,
            `${inputPath}.operations`,
            errors
          );
      }
    });
    if (inputErrors.length > 0) {
      const operationNumber = getOperationNumber(operationPath);
      errors.push(`Please fix error in operation ${operationNumber}`);
    }
  });
  return state;
};

const validateScriptEditorField = (
  state: ScriptEditorState,
  path: string,
  errors: string[]
) => {
  const valuePath = `${path}.value`;
  const errorPath = `${path}.error`;
  const rulesPath = `${path}.rules`;
  const value = get(state, valuePath);
  const rules = get(state, rulesPath);
  const error = validateInput(value, rules);
  if (error) {
    state = set(state, errorPath, error);
    errors.push(error);
  }
  return state;
};

export const validateScriptEditorState = (
  state: ScriptEditorState
): { errors: string[]; newState: ScriptEditorState } => {
  const errors: string[] = [];
  const nameFieldPath = "information.name";
  const descFieldPath = "information.description";
  let newState = state;
  newState = validateScriptEditorField(newState, nameFieldPath, errors);
  newState = validateScriptEditorField(newState, descFieldPath, errors);
  newState = validateScriptEditorOperations(newState, "operations", errors);
  return { errors, newState };
};
