import { get, set, wrap } from "object-path-immutable";
import { INPUT_TYPES } from "../../common/constants/input";
import {
  VARIABLE_SETTER_MODES,
  VARIABLE_TYPES
} from "../../common/constants/variable";
import {
  LargeOperation,
  LargeTextInput
} from "../../common/types/largeOperation";
import { Variable } from "../../common/types/variable";
import {
  convertToLargeOperation,
  convertToSmallOperation,
  validateInput
} from "../../common/utils/operation";
import { INITIAL_SCRIPT_EDITOR_STATE } from "../constants/scriptEditor";
import { Script } from "../types/script";
import {
  OperationsPathAndIndex,
  ScriptEditorState,
  ValidatedData
} from "../types/scriptEditor";

export const getOperationsPathAndIndex = (
  path: string
): OperationsPathAndIndex => {
  const splittedPath = path.split(".");
  const operationsPath = splittedPath.slice(0, -1).join(".");
  const index = Number.parseInt(splittedPath.at(-1) || "NaN");
  return { operationsPath, index };
};

export const getOperationNumber = (path: string): string =>
  path
    .split(/\D+/g)
    .filter(Boolean)
    .filter((_, index) => index % 2 === 0)
    .map((num) => Number(num) + 1)
    .join(".");

export const updateVariables = (
  path: string,
  value: string,
  mode: VARIABLE_SETTER_MODES,
  variables: Variable[]
): Variable[] => {
  const newVariables = variables;
  const foundIndex = variables.findIndex((item) => item.path === path);
  switch (mode) {
    case VARIABLE_SETTER_MODES.NAME:
      {
        if (foundIndex > -1) {
          newVariables[foundIndex].name = value;
        } else {
          newVariables.push({
            path,
            name: value,
            type: VARIABLE_TYPES.NUMBER
          });
        }
      }
      break;
    case VARIABLE_SETTER_MODES.TYPE: {
      if (foundIndex > -1) {
        newVariables[foundIndex].type = value;
      }
    }
    default:
      break;
  }
  return newVariables;
};

export const updateScriptEditorField = (
  state: ScriptEditorState,
  path: string,
  value: string
): ScriptEditorState => {
  const valuePath = `${path}.value`;
  const errorPath = `${path}.error`;
  const field = get(state, path) as LargeTextInput;
  const error = validateInput(value, field.rules);
  let wrappedState = wrap(state).set(valuePath, value).set(errorPath, error);
  if (field.variableSetter) {
    const oldVariables = get(state, "variables", []);
    const operationPath = path.split(".").slice(0, -2).join(".");
    const newVariables = updateVariables(
      operationPath,
      value,
      field.variableSetter.mode,
      oldVariables
    );
    wrappedState = wrappedState.set("variables", newVariables);
  }
  return wrappedState.value();
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
  path: string
): ValidatedData => {
  let newState = state;
  const errors: string[] = [];

  const operations = get(state, path) as LargeOperation[];

  for (let i = 0; i < operations.length; i++) {
    const operation = operations[i];
    const inputErrors: string[] = [];
    const operationPath = `${path}.${i}`;

    for (let j = 0; j < operation.inputs.length; j++) {
      const input = operation.inputs[j];

      switch (input.type) {
        case INPUT_TYPES.TEXT:
        case INPUT_TYPES.SELECT:
          const inputPath = `${operationPath}.inputs.${j}`;
          const validatedFieldData = validateScriptEditorField(
            newState,
            inputPath
          );
          if (validatedFieldData.errors.length > 0) {
            inputErrors.push(...validatedFieldData.errors);
            newState = validatedFieldData.newState;
          }
          break;
        case INPUT_TYPES.OPERATION_BOX:
          const operationsPath = `${operationPath}.inputs.${j}.operations`;
          const validatedOperationsData = validateScriptEditorOperations(
            newState,
            operationsPath
          );
          if (validatedOperationsData.errors.length > 0) {
            errors.push(...validatedOperationsData.errors);
            newState = validatedOperationsData.newState;
          }
          break;
      }
    }
    if (inputErrors.length > 0) {
      const operationNumber = getOperationNumber(operationPath);
      errors.push(`Please fix error in operation ${operationNumber}`);
    }
  }

  return { newState, errors };
};

const validateScriptEditorField = (
  state: ScriptEditorState,
  path: string
): ValidatedData => {
  let newState = state;
  const errors: string[] = [];

  const valuePath = `${path}.value`;
  const errorPath = `${path}.error`;
  const rulesPath = `${path}.rules`;
  const value = get(state, valuePath);
  const rules = get(state, rulesPath);
  const error = validateInput(value, rules);

  if (error) {
    errors.push(error);
    newState = set(state, errorPath, error);
  }

  return { errors, newState };
};

export const validateScriptEditorState = (
  state: ScriptEditorState
): ValidatedData => {
  let newState = state;
  const errors: string[] = [];

  const validatedNameData = validateScriptEditorField(
    newState,
    "information.name"
  );
  if (validatedNameData.errors.length > 0) {
    errors.push(...validatedNameData.errors);
    newState = validatedNameData.newState;
  }

  const validatedDescriptionData = validateScriptEditorField(
    newState,
    "information.description"
  );
  if (validatedDescriptionData.errors.length > 0) {
    errors.push(...validatedDescriptionData.errors);
    newState = validatedDescriptionData.newState;
  }

  const validatedOperationsData = validateScriptEditorOperations(
    newState,
    "operations"
  );
  if (validatedOperationsData.errors) {
    errors.push(...validatedOperationsData.errors);
    newState = validatedOperationsData.newState;
  }

  return { errors, newState };
};
