import { VALIDATION_REGEXES } from "../constants/validation";
import { INPUT_TYPES, OPERTAIONS } from "../constants/operations";
import { ValidationRule } from "../types/validation";
import { Input, Operation } from "../types/operation";
import { ScriptEditorState } from "../types/scriptEditor";
import { Script, SmallOperation } from "../types/script";
import { INITIAL_SCRIPT_EDITOR_STATE } from "../constants/scriptEditor";

// export const convertToLargeOperations = (
//   operations: SmallOperation[]
// ): Operation[] => {
//   const resultArr = [];
//   for (let i = 0; i < operations.length; i++) {
//     const temp = OPERTAIONS[operations[i].type];
//     for (let j = 0; j < temp.inputs.length; j++) {
//       if (temp.inputs[j].type !== INPUT_TYPES.OPERATION_BOX) {
//         temp.inputs[j] = {}
//       }
//     }
//     resultArr.push(temp);
//   }
//   return resultArr;
// };

export const convertToSmallOperations = (
  operations: Operation[]
): SmallOperation[] =>
  operations.map((item) => {
    return {
      type: item.type,
      inputs: item.inputs.map((input) => {
        switch (input.type) {
          case INPUT_TYPES.TEXT:
          case INPUT_TYPES.TEXTAREA:
            return {
              type: input.type,
              value: input.value
            };
          case INPUT_TYPES.OPERATION_BOX:
            return {
              type: input.type,
              operations: convertToSmallOperations(input.operations)
            };
        }
      })
    };
  });

export const convertToScript = (state: ScriptEditorState): Script => {
  return {
    id: state.scriptId,
    name: state.information.name.value,
    description: state.information.description.value,
    operations: convertToSmallOperations(state.operations)
  };
};

export const convertToEditorState = (script: Script): ScriptEditorState => {
  const editorState = INITIAL_SCRIPT_EDITOR_STATE;
  editorState.scriptId = script.id;
  editorState.information.name.value = script.name;
  editorState.information.description.value = script.description;
  return editorState;
};

export const formatHeading = (format: string, inputs: Input[]): string =>
  format.replace(/{[\w-]+}/g, (match: string) => {
    const index = Number.parseInt(match.slice(1, -1));
    const input = inputs[index];
    if ("value" in input) {
      return input.value || "undefined";
    }
    return "";
  });

export const validateInput = (
  value: string,
  rules: ValidationRule[]
): string => {
  for (let i = 0; i < rules.length; i++) {
    const regex = VALIDATION_REGEXES[rules[i].type];
    if (regex && !regex.test(value)) {
      return rules[i].message;
    }
  }
  return "";
};
