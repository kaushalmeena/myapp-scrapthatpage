import produce from "immer";
import { WritableDraft } from "immer/dist/internal";
import { get, set } from "object-path";
import { INPUT_TYPES } from "../constants/input";
import { INITIAL_SCRIPT_EDITOR_STATE } from "../constants/scriptEditor";
import { Script } from "../types/script";
import { ScriptEditorState } from "../types/scriptEditor";
import {
  convertToLargeOperations,
  convertToSmallOperations,
  validateInput
} from "./operation";

export const getOperationPathAndIndex = (
  path: string
): {
  operationPath: string;
  operationIndex: number;
} => {
  const lastIndex = path.lastIndexOf(".");
  const operationPath = path.substr(0, lastIndex);
  const operationIndex = Number.parseInt(path.substr(lastIndex + 1, 1));
  return { operationPath, operationIndex };
};

export const getOperationNumber = (path: string): string =>
  path
    .split(/\D+/g)
    .filter(Boolean)
    .map((num) => Number(num) + 1)
    .join(".");

export const updateScriptEditorField = (
  draft: WritableDraft<ScriptEditorState>,
  value: string,
  path: string
): void => {
  const valuePath = `${path}.value`;
  const errorPath = `${path}.error`;
  const rulesPath = `${path}.rules`;
  const rules = get(draft, rulesPath);
  const error = validateInput(value, rules);
  set(draft, valuePath, value);
  set(draft, errorPath, error);
};

export const swapScriptEditorOperations = (
  draft: WritableDraft<ScriptEditorState>,
  path1: string,
  path2: string
): void => {
  const operation1 = get(draft, path1);
  const operation2 = get(draft, path2);
  set(draft, path1, operation2);
  set(draft, path2, operation1);
};

export const getScriptFromScriptEditorState = (
  state: ScriptEditorState
): Script => {
  return {
    id: state.scriptId,
    name: state.information.name.value,
    description: state.information.description.value,
    operations: convertToSmallOperations(state.operations)
  };
};

export const getScriptEditorStateFromScript = (
  script: Script
): ScriptEditorState => {
  return produce(INITIAL_SCRIPT_EDITOR_STATE, (draft) => {
    draft.scriptId = script.id;
    draft.information.name.value = script.name;
    draft.information.description.value = script.description;
    draft.operations = convertToLargeOperations(script.operations);
  });
};

const validateScriptEditorOperationsDraft = (
  draft: WritableDraft<ScriptEditorState>,
  path: string,
  errors: string[]
) => {
  draft.operations.forEach((operation, operationIndex) => {
    const inputErrors: string[] = [];
    const operationPath = `${path}.${operationIndex}`;
    operation.inputs.forEach((input, inputIndex) => {
      const inputPath = `${operationPath}.inputs.${inputIndex}`;
      switch (input.type) {
        case INPUT_TYPES.TEXT:
        case INPUT_TYPES.TEXTAREA:
          validateScriptEditorField(draft, inputPath, inputErrors);
          break;
        case INPUT_TYPES.OPERATION_BOX:
          validateScriptEditorOperationsDraft(
            draft,
            `${inputPath}.operations`,
            errors
          );
      }
    });
    if (inputErrors.length > 0) {
      const operationNumber = getOperationNumber(operationPath);
      errors.push(`Please fix error(s) in operation no. ${operationNumber}`);
    }
  });
};

const validateScriptEditorField = (
  draft: WritableDraft<ScriptEditorState>,
  path: string,
  errors: string[]
) => {
  const valuePath = `${path}.value`;
  const errorPath = `${path}.error`;
  const rulesPath = `${path}.rules`;
  const value = get(draft, valuePath);
  const rules = get(draft, rulesPath);
  const error = validateInput(value, rules);
  set(draft, errorPath, error);
  if (error) {
    errors.push(error);
  }
};

export const validateScriptEditorState = (
  state: ScriptEditorState
): { errors: string[]; newState: ScriptEditorState } => {
  const errors: string[] = [];
  const newState = produce(state, (draft) => {
    validateScriptEditorField(draft, "information.name", errors);
    validateScriptEditorField(draft, "information.description", errors);
    validateScriptEditorOperationsDraft(draft, "operations", errors);
  });
  return { errors, newState };
};
