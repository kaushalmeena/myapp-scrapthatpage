import { get, set, wrap } from "object-path-immutable";
import { INPUT_TYPES } from "../../../common/constants/input";
import {
  VARIABLE_PICKER_MODES,
  VARIABLE_SETTER_MODES,
  VARIABLE_TYPES
} from "../../../common/constants/variable";
import {
  LargeOperation,
  LargeTextInput
} from "../../../common/types/largeOperation";
import { Variable } from "../../../common/types/variable";
import {
  convertToLargeOperation,
  convertToSmallOperation,
  validateInput
} from "../../../common/utils/operation";
import { Script } from "../../types/script";
import { INITIAL_SCRIPT_EDITOR_STATE } from "./constants";
import {
  OperationsPathAndIndex,
  ScriptEditorState,
  ValidatedData
} from "./types";

export const updateDraftScriptEditorField = (
  state: ScriptEditorState,
  path: string,
  value: string
): void => {
  const field = get(state, path) as LargeTextInput;
  field.error = validateInput(value, field.rules);
  field.value = value;
  if (field.variableSetter) {
    const oldVariables = state.variables;
    const operationPath = path.split(".").slice(0, -2).join(".");
    const newVariables = getUpdatedVariables(
      operationPath,
      value,
      field.variableSetter.mode,
      oldVariables
    );
    state.variables = newVariables;
  }
};

export const getUpdatedInputValueWithVariable = (
  value: string,
  mode: VARIABLE_PICKER_MODES,
  variable: Variable
): string => {
  let newValue = "";
  switch (mode) {
    case VARIABLE_PICKER_MODES.SET:
      newValue = variable.name;
      break;
    case VARIABLE_PICKER_MODES.APPEND:
      newValue = `${value}{{${variable.name}}}`;
      break;
  }
  return newValue;
};

export const getUpdatedVariables = (
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
  const newErrors: string[] = [];

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
            newErrors.push(...validatedOperationsData.errors);
            newState = validatedOperationsData.newState;
          }
          break;
      }
    }
    if (inputErrors.length > 0) {
      const operationNumber = getOperationNumber(operationPath);
      newErrors.push(`Please fix error in operation ${operationNumber}`);
    }
  }

  return { newState, errors: newErrors };
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
