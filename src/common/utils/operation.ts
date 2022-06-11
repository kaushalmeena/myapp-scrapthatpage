import { chain, find } from "lodash";
import { InputTypes } from "../constants/input";
import { LARGE_OPERATIONS } from "../constants/largeOperations";
import { OperationTypes } from "../constants/operation";
import { VALIDATION_FUNCTION } from "../constants/validation";
import { LargeInput, LargeOperation } from "../types/largeOperation";
import { SmallInput, SmallOperation } from "../types/smallOperation";
import { ValidationRule } from "../types/validation";

export const getOperationSubheader = (
  format: string,
  inputs: LargeInput[] | SmallInput[]
): string =>
  format.replace(/{[\w-]+}/g, (match: string) => {
    const index = Number.parseInt(match.slice(1, -1), 10);
    const input = inputs[index];
    if ("value" in input) {
      return input.value || "undefined";
    }
    return "";
  });

export const convertToLargeOperation = (
  operation: SmallOperation
): LargeOperation => {
  const baseLargeOperation = find(LARGE_OPERATIONS, ["type", operation.type]);
  if (!baseLargeOperation) {
    throw new Error(`Operation type of ${operation.type} not found.`);
  }
  let chainedOperation = chain(baseLargeOperation).cloneDeep();
  switch (operation.type) {
    case OperationTypes.OPEN:
    case OperationTypes.CLICK:
      chainedOperation = chainedOperation.set(
        "inputs.0.value",
        operation.inputs[0].value
      );
      break;
    case OperationTypes.EXTRACT:
    case OperationTypes.SET:
      chainedOperation = chainedOperation
        .set("inputs.0.value", operation.inputs[0].value)
        .set("inputs.1.value", operation.inputs[1].value)
        .set("inputs.2.value", operation.inputs[2].value);
      break;
    case OperationTypes.TYPE:
    case OperationTypes.INCREASE:
    case OperationTypes.DECREASE:
      chainedOperation = chainedOperation
        .set("inputs.0.value", operation.inputs[0].value)
        .set("inputs.1.value", operation.inputs[1].value);
      break;
    case OperationTypes.IF:
    case OperationTypes.WHILE:
      chainedOperation = chainedOperation
        .set("inputs.0.value", operation.inputs[0].value)
        .set(
          "inputs.1.operations",
          operation.inputs[1].operations.map(convertToLargeOperation)
        );
      break;
    default:
  }
  return chainedOperation.value();
};

export const convertToSmallOperation = (
  operation: LargeOperation
): SmallOperation => {
  switch (operation.type) {
    case OperationTypes.OPEN:
    case OperationTypes.CLICK:
      return {
        type: operation.type,
        inputs: [
          {
            type: InputTypes.TEXT,
            value: operation.inputs[0].value
          }
        ]
      };
    case OperationTypes.EXTRACT:
      return {
        type: operation.type,
        inputs: [
          {
            type: InputTypes.TEXT,
            value: operation.inputs[0].value
          },
          {
            type: InputTypes.TEXT,
            value: operation.inputs[1].value
          },
          {
            type: InputTypes.SELECT,
            value: operation.inputs[2].value
          }
        ]
      };
    case OperationTypes.TYPE:
    case OperationTypes.INCREASE:
    case OperationTypes.DECREASE:
      return {
        type: operation.type,
        inputs: [
          {
            type: InputTypes.TEXT,
            value: operation.inputs[0].value
          },
          {
            type: InputTypes.TEXT,
            value: operation.inputs[1].value
          }
        ]
      };
    case OperationTypes.SET:
      return {
        type: operation.type,
        inputs: [
          {
            type: InputTypes.TEXT,
            value: operation.inputs[0].value
          },
          {
            type: InputTypes.SELECT,
            value: operation.inputs[1].value
          },
          {
            type: InputTypes.TEXT,
            value: operation.inputs[2].value
          }
        ]
      };
    case OperationTypes.IF:
    case OperationTypes.WHILE:
      return {
        type: operation.type,
        inputs: [
          {
            type: InputTypes.TEXT,
            value: operation.inputs[0].value
          },
          {
            type: InputTypes.OPERATION_BOX,
            operations: operation.inputs[1].operations.map(
              convertToSmallOperation
            )
          }
        ]
      };
    default:
      return {
        type: OperationTypes.OPEN,
        inputs: [
          {
            type: InputTypes.TEXT,
            value: ""
          }
        ]
      };
  }
};

export const isOperationValid = (operation: LargeOperation): boolean =>
  operation.inputs.some((input) => "error" in input && !input.error);

export const validateValueWithRules = (
  value: string,
  rules: ValidationRule[]
): string => {
  for (let i = 0; i < rules.length; i += 1) {
    const validate = VALIDATION_FUNCTION[rules[i].type];
    if (validate && !validate(value)) {
      return rules[i].message;
    }
  }
  return "";
};
