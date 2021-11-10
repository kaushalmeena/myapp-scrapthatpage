import { get, wrap } from "object-path-immutable";
import { INPUT_TYPES } from "../constants/input";
import { LARGE_OPERTAIONS } from "../constants/largeOperations";
import { OPERATION_TYPES } from "../constants/operation";
import { VALIDATION_FUNCTION } from "../constants/validation";
import { LargeInput, LargeOperation } from "../types/largeOperation";
import { SmallInput, SmallOperation } from "../types/smallOperation";
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
  let wrappedOperation = wrap(LARGE_OPERTAIONS[operation.type]);
  switch (operation.type) {
    case OPERATION_TYPES.OPEN:
    case OPERATION_TYPES.CLICK:
      wrappedOperation = wrappedOperation.set(
        "inputs.0.value",
        operation.inputs[0].value
      );
      break;
    case OPERATION_TYPES.EXTRACT:
    case OPERATION_TYPES.SET:
      wrappedOperation = wrappedOperation
        .set("inputs.0.value", operation.inputs[0].value)
        .set("inputs.1.value", operation.inputs[1].value)
        .set("inputs.2.value", operation.inputs[2].value);
      break;
    case OPERATION_TYPES.TYPE:
    case OPERATION_TYPES.INCREASE:
    case OPERATION_TYPES.DECREASE:
      wrappedOperation = wrappedOperation
        .set("inputs.0.value", operation.inputs[0].value)
        .set("inputs.1.value", operation.inputs[1].value);
      break;
    case OPERATION_TYPES.IF:
    case OPERATION_TYPES.WHILE:
      wrappedOperation = wrappedOperation
        .set("inputs.0.value", operation.inputs[0].value)
        .set(
          "inputs.1.operations",
          operation.inputs[1].operations.map(convertToLargeOperation)
        );
      break;
  }
  return wrappedOperation.value();
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
          },
          {
            type: INPUT_TYPES.SELECT,
            value: operation.inputs[2].value
          }
        ]
      };
    case OPERATION_TYPES.TYPE:
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
    case OPERATION_TYPES.SET:
      return {
        type: operation.type,
        inputs: [
          {
            type: INPUT_TYPES.TEXT,
            value: operation.inputs[0].value
          },
          {
            type: INPUT_TYPES.SELECT,
            value: operation.inputs[1].value
          },
          {
            type: INPUT_TYPES.TEXT,
            value: operation.inputs[2].value
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
