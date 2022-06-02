import { Draft } from "@reduxjs/toolkit";
import { get, set, wrap } from "object-path-immutable";
import { InputTypes } from "../../../common/constants/input";
import {
  VariablePickerModes,
  VariableSetterModes,
  VariableTypes
} from "../../../common/constants/variable";
import {
  LargeOperation,
  LargeTextInput
} from "../../../common/types/largeOperation";
import { Variable } from "../../../common/types/variable";
import {
  convertToLargeOperation,
  convertToSmallOperation,
  validateValueWithRules
} from "../../../common/utils/operation";
import { Script } from "../../types/script";
import { INITIAL_SCRIPT_EDITOR_STATE } from "./constants";
import {
  OperationsPathAndIndex,
  ScriptEditorState,
  ValidatedData
} from "./types";

export const getUpdatedInputValueWithVariable = (
  value: string,
  mode: VariablePickerModes,
  variable: Variable
): string => {
  switch (mode) {
    case VariablePickerModes.SET:
      return variable.name;
    case VariablePickerModes.APPEND:
      return `${value}{{${variable.name}}}`;
    default:
  }
  return "";
};

export const getUpdatedVariables = (
  path: string,
  value: string,
  mode: VariableSetterModes,
  variables: Variable[]
): Variable[] => {
  const newVariables = variables;
  const foundIndex = variables.findIndex((item) => item.path === path);
  switch (mode) {
    case VariableSetterModes.NAME:
      if (foundIndex > -1) {
        newVariables[foundIndex].name = value;
      } else {
        newVariables.push({
          path,
          name: value,
          type: VariableTypes.NUMBER
        });
      }
      break;
    case VariableSetterModes.TYPE:
      if (foundIndex > -1) {
        newVariables[foundIndex].type = value;
      }
      break;
    default:
  }
  return newVariables;
};

export const updateDraftScriptEditorField = (
  state: Draft<ScriptEditorState>,
  path: string,
  value: string
): void => {
  const field = get(state, path) as LargeTextInput;
  field.error = validateValueWithRules(value, field.rules);
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

export const getOperationsPathAndIndex = (
  path: string
): OperationsPathAndIndex => {
  const splittedPath = path.split(".");
  const operationsPath = splittedPath.slice(0, -1).join(".");
  const index = Number.parseInt(splittedPath.at(-1) || "NaN", 10);
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
  wrap(INITIAL_SCRIPT_EDITOR_STATE)
    .set("id", script.id)
    .set("favorite", script.favorite)
    .set("information.name.value", script.name)
    .set("information.description.value", script.description)
    .set("operations", script.operations.map(convertToLargeOperation))
    .value();

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
  const error = validateValueWithRules(value, rules);

  if (error) {
    errors.push(error);
    newState = set(state, errorPath, error);
  }

  return { errors, newState };
};

const validateScriptEditorOperations = (
  state: ScriptEditorState,
  path: string
): ValidatedData => {
  let newState = state;
  const newErrors: string[] = [];

  const operations = get(state, path) as LargeOperation[];

  for (let i = 0; i < operations.length; i += 1) {
    const operation = operations[i];
    const inputErrors: string[] = [];
    const operationPath = `${path}.${i}`;

    for (let j = 0; j < operation.inputs.length; j += 1) {
      const input = operation.inputs[j];

      switch (input.type) {
        case InputTypes.TEXT:
        case InputTypes.SELECT:
          {
            const inputPath = `${operationPath}.inputs.${j}`;
            const validatedFieldData = validateScriptEditorField(
              newState,
              inputPath
            );
            if (validatedFieldData.errors.length > 0) {
              inputErrors.push(...validatedFieldData.errors);
              newState = validatedFieldData.newState;
            }
          }
          break;
        case InputTypes.OPERATION_BOX:
          {
            const operationsPath = `${operationPath}.inputs.${j}.operations`;
            const validatedOperationsData = validateScriptEditorOperations(
              newState,
              operationsPath
            );
            if (validatedOperationsData.errors.length > 0) {
              newErrors.push(...validatedOperationsData.errors);
              newState = validatedOperationsData.newState;
            }
          }
          break;
        default:
      }
    }
    if (inputErrors.length > 0) {
      const operationNumber = getOperationNumber(operationPath);
      newErrors.push(`Please fix error in operation ${operationNumber}`);
    }
  }

  return { newState, errors: newErrors };
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
