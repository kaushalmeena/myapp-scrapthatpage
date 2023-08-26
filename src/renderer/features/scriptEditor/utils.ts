import { produce, Draft } from "immer";
import { get, set, chain } from "lodash";
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
import {
  OperationsPathAndIndex,
  ScriptEditorState,
  ValidatedScriptEditorData
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

export const updateDraftScriptEditorVariables = (
  state: Draft<ScriptEditorState>,
  path: string,
  value: string,
  mode: VariableSetterModes
) => {
  const foundIndex = state.variables.findIndex((item) => item.path === path);

  switch (mode) {
    case VariableSetterModes.NAME:
      if (foundIndex > -1) {
        state.variables[foundIndex].name = value;
      } else {
        state.variables.push({
          path,
          name: value,
          type: VariableTypes.NUMBER
        });
      }
      break;
    case VariableSetterModes.TYPE:
      if (foundIndex > -1) {
        state.variables[foundIndex].type = value;
      }
      break;
    default:
  }
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
    const operationPath = path.split(".").slice(0, -2).join(".");
    updateDraftScriptEditorVariables(
      state,
      operationPath,
      value,
      field.variableSetter.mode
    );
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
  chain(INITIAL_SCRIPT_EDITOR_STATE)
    .cloneDeep()
    .set("id", script.id)
    .set("favorite", script.favorite)
    .set("information.name.value", script.name)
    .set("information.description.value", script.description)
    .set("operations", script.operations.map(convertToLargeOperation))
    .value();

const validateDraftScriptEditorField = (
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

const validateDraftScriptEditorOperations = (
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
      const input = operation.inputs[j];
      switch (input.type) {
        case InputTypes.TEXT:
        case InputTypes.SELECT:
          {
            const inputPath = `${operationPath}.inputs.${j}`;
            validateDraftScriptEditorField(state, inputPath, inputErrors);
          }
          break;
        case InputTypes.OPERATION_BOX:
          {
            const operationsPath = `${operationPath}.inputs.${j}.operations`;
            validateDraftScriptEditorOperations(state, operationsPath, errors);
          }
          break;
        default:
      }
    }

    if (inputErrors.length > 0) {
      const operationNumber = getOperationNumber(operationPath);
      errors.push(`Please fix error in operation ${operationNumber}`);
    }
  }
};

export const validateScriptEditorState = (
  state: ScriptEditorState
): ValidatedScriptEditorData => {
  const errors: string[] = [];

  const validatedState = produce(state, (draft) => {
    validateDraftScriptEditorField(draft, "information.name", errors);
    validateDraftScriptEditorField(draft, "information.description", errors);
    validateDraftScriptEditorOperations(draft, "operations", errors);
  });

  return { errors, validatedState };
};
