import produce from "immer";
import { INPUT_TYPES } from "../constants/input";
import { LARGE_OPERTAIONS } from "../constants/largeOperations";
import { VALIDATION_REGEXES } from "../constants/validation";
import { LargeInput, LargeOperation } from "../types/largeOperation";
import { SmallOperation } from "../types/smallOperation";
import { ValidationRule } from "../types/validation";

export const convertToLargeOperations = (
  operations: SmallOperation[]
): LargeOperation[] =>
  operations.map((operation) => {
    return produce(LARGE_OPERTAIONS[operation.type], (draft) => {
      draft.inputs = operation.inputs.map((input, index) => {
        const largeInput = draft.inputs[index];
        switch (input.type) {
          case INPUT_TYPES.TEXT:
          case INPUT_TYPES.TEXTAREA:
            return {
              ...largeInput,
              value: input.value
            };
          case INPUT_TYPES.OPERATION_BOX:
            return {
              ...largeInput,
              operations: convertToLargeOperations(input.operations)
            };
        }
      });
    });
  });

export const convertToSmallOperations = (
  operations: LargeOperation[]
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

export const formatHeading = (format: string, inputs: LargeInput[]): string =>
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
