import { Draft, produce } from "immer";
import { chain, get, set } from "lodash";
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
import { ValidationRule } from "../../../common/types/validation";
import { Variable } from "../../../common/types/variable";
import {
  convertToLargeOperation,
  convertToSmallOperation,
  validateValueWithRules
} from "../../../common/utils/operation";
import { Script } from "../../types/script";
import { INITIAL_SCRIPT_EDITOR_STATE } from "./constants";
import { ScriptEditorState } from "./types";

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
  }
  return "";
};

export const updateScriptEditorVariables = (
  state: Draft<ScriptEditorState>,
  path: string,
  value: string,
  mode: VariableSetterModes
) => {
  const foundIdx = state.variables.findIndex((item) => item.path === path);

  switch (mode) {
    case VariableSetterModes.NAME:
      if (foundIdx > -1) {
        state.variables[foundIdx].name = value;
      } else {
        state.variables.push({
          path,
          name: value,
          type: VariableTypes.NUMBER
        });
      }
      break;
    case VariableSetterModes.TYPE:
      if (foundIdx > -1) {
        state.variables[foundIdx].type = value;
      }
      break;
  }
};

export const updateScriptEditorField = (
  state: Draft<ScriptEditorState>,
  path: string,
  value: string
) => {
  const field = get(state, path) as LargeTextInput;
  field.error = validateValueWithRules(value, field.rules);
  field.value = value;

  if (field.variableSetter) {
    const operationPath = path.split(".").slice(0, -2).join(".");
    updateScriptEditorVariables(
      state,
      operationPath,
      value,
      field.variableSetter.mode
    );
  }
};

export const getOperationsPathInfo = (path: string) => {
  const splittedPath = path.split(".");
  const operationsPath = splittedPath.slice(0, -1).join(".");
  const index = Number.parseInt(splittedPath.at(-1) || "NaN", 10);
  return { operationsPath, index };
};

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
  chain(INITIAL_SCRIPT_EDITOR_STATE)
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
  const error = validateValueWithRules(value, rules);

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
        case InputTypes.TEXT:
        case InputTypes.SELECT:
          {
            const inputPath = `${operationPath}.inputs.${j}`;
            validateScriptEditorField(state, inputPath, inputErrors);
          }
          break;
        case InputTypes.OPERATION_BOX:
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
