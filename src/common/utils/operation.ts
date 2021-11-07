import { get } from "object-path-immutable";
import { INPUT_TYPES } from "../constants/input";
import { LARGE_OPERTAIONS } from "../constants/largeOperations";
import { OPERATION_TYPES } from "../constants/operation";
import { VALIDATION_FUNCTION } from "../constants/validation";
import { LargeInput, LargeOperation } from "../types/largeOperation";
import {
  SmallInput,
  SmallOperation,
  SmallOperationBoxInput,
  SmallTextInput
} from "../types/smallOperation";
import { ValidationRule } from "../types/validation";

export const getLargeOperation = (type: OPERATION_TYPES): LargeOperation =>
  get(LARGE_OPERTAIONS[type]);

export const getOperationSubheader = (
  format: string,
  inputs: LargeInput[] | SmallInput[]
): string =>
  format.replace(/{[\w-]+}/g, (match: string) => {
    const index = Number.parseInt(match.slice(1, -1));
    const input = inputs[index];
    if ("value" in input) {
      return input.value || "undefined";
    }
    return "";
  });

export const convertToLargeOperation = (
  operation: SmallOperation
): LargeOperation => {
  const largeOperation = getLargeOperation(operation.type);
  switch (largeOperation.type) {
    case OPERATION_TYPES.OPEN:
    case OPERATION_TYPES.CLICK:
      largeOperation.inputs[0].value = operation.inputs[0].value;
      break;
    case OPERATION_TYPES.EXTRACT:
    case OPERATION_TYPES.TYPE:
    case OPERATION_TYPES.SET:
    case OPERATION_TYPES.INCREASE:
    case OPERATION_TYPES.DECREASE:
      largeOperation.inputs[0].value = operation.inputs[0].value;
      largeOperation.inputs[1].value = (
        operation.inputs[1] as SmallTextInput
      ).value;
      break;
    case OPERATION_TYPES.IF:
    case OPERATION_TYPES.WHILE:
      largeOperation.inputs[0].value = operation.inputs[0].value;
      largeOperation.inputs[1].operations = (
        operation.inputs[1] as SmallOperationBoxInput
      ).operations.map(convertToLargeOperation);
      break;
  }
  return largeOperation;
};

export const convertToSmallOperation = (
  operation: LargeOperation
): SmallOperation => {
  switch (operation.type) {
    case OPERATION_TYPES.OPEN:
    case OPERATION_TYPES.CLICK:
      return {
        type: operation.type,
        inputs: [
          {
            type: INPUT_TYPES.TEXT,
            value: operation.inputs[0].value
          }
        ]
      };
    case OPERATION_TYPES.EXTRACT:
    case OPERATION_TYPES.TYPE:
    case OPERATION_TYPES.SET:
    case OPERATION_TYPES.INCREASE:
    case OPERATION_TYPES.DECREASE:
      return {
        type: operation.type,
        inputs: [
          {
            type: INPUT_TYPES.TEXT,
            value: operation.inputs[0].value
          },
          {
            type: INPUT_TYPES.TEXT,
            value: operation.inputs[1].value
          }
        ]
      };
    case OPERATION_TYPES.IF:
    case OPERATION_TYPES.WHILE:
      return {
        type: operation.type,
        inputs: [
          {
            type: INPUT_TYPES.TEXT,
            value: operation.inputs[0].value
          },
          {
            type: INPUT_TYPES.OPERATION_BOX,
            operations: operation.inputs[1].operations.map(
              convertToSmallOperation
            )
          }
        ]
      };
  }
};

export const isOperationValid = (operation: LargeOperation): boolean =>
  operation.inputs.some((input) => "error" in input && !input.error);

export const validateInput = (
  value: string,
  rules: ValidationRule[]
): string => {
  for (let i = 0; i < rules.length; i++) {
    const validate = VALIDATION_FUNCTION[rules[i].type];
    if (validate && !validate(value)) {
      return rules[i].message;
    }
  }
  return "";
};
