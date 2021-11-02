import produce from "immer";
import { WritableDraft } from "immer/dist/internal";
import { get, set } from "object-path";
import { INPUT_TYPES } from "../constants/input";
import { INITIAL_SCRIPT_EDITOR_STATE } from "../constants/scriptEditor";
import { Script } from "../types/script";
import { ScriptEditorState } from "../types/scriptEditor";
import {
  getLargeOperations,
  getSmallOperations,
  validateInput
} from "./operation";

export const getOperationPathAndIndex = (
  path: string
): {
  path: string;
  index: number;
} => {
  const lastIndex = path.lastIndexOf(".");
  const operationPath = path.substr(0, lastIndex);
  const operationIndex = Number.parseInt(path.substr(lastIndex + 1, 1));
  return { path: operationPath, index: operationIndex };
};

export const getOperationNumber = (path: string): string =>
  path
    .split(/\D+/g)
    .filter(Boolean)
    .map((num) => Number(num) + 1)
    .join(".");

export const updateScriptEditorFieldDraft = (
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
    id: state.id,
    favorite: state.favorite,
    name: state.information.name.value,
    description: state.information.description.value,
    operations: getSmallOperations(state.operations)
  };
};

export const getScriptEditorStateFromScript = (
  script: Script
): ScriptEditorState => {
  return produce(INITIAL_SCRIPT_EDITOR_STATE, (draft) => {
    draft.id = script.id;
    draft.favorite = script.favorite;
    draft.information.name.value = script.name;
    draft.information.description.value = script.description;
    draft.operations = getLargeOperations(script.operations);
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
          validateScriptEditorFieldDraft(draft, inputPath, inputErrors);
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
      errors.push(`Please fix error in operation ${operationNumber}`);
    }
  });
};

const validateScriptEditorFieldDraft = (
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
    validateScriptEditorFieldDraft(draft, "information.name", errors);
    validateScriptEditorFieldDraft(draft, "information.description", errors);
    validateScriptEditorOperationsDraft(draft, "operations", errors);
  });
  return { errors, newState };
};
