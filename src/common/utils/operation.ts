import { chain } from "lodash";
import { LARGE_OPERATIONS } from "../constants/largeOperations";
import { VALIDATION_FUNCTION } from "../constants/validation";
import { LargeInput, LargeOperation } from "../types/largeOperation";
import { SmallInput, SmallOperation } from "../types/smallOperation";
import { ValidationRule } from "../types/validation";

export const getOperationSubheader = (
  format: string,
  inputs: LargeInput[] | SmallInput[]
) =>
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
  const baseLargeOperation = LARGE_OPERATIONS.find(
    (item) => item.type === operation.type
  );
  if (!baseLargeOperation) {
    throw new Error(`Operation type of ${operation.type} not found.`);
  }
  let chainedOperation = chain(baseLargeOperation).cloneDeep();
  switch (operation.type) {
    case "open":
    case "click":
      chainedOperation = chainedOperation.set(
        "inputs.0.value",
        operation.inputs[0].value
      );
      break;
    case "extract":
    case "set":
      chainedOperation = chainedOperation
        .set("inputs.0.value", operation.inputs[0].value)
        .set("inputs.1.value", operation.inputs[1].value)
        .set("inputs.2.value", operation.inputs[2].value);
      break;
    case "type":
    case "increase":
    case "decrease":
      chainedOperation = chainedOperation
        .set("inputs.0.value", operation.inputs[0].value)
        .set("inputs.1.value", operation.inputs[1].value);
      break;
    case "if":
    case "while":
      chainedOperation = chainedOperation
        .set("inputs.0.value", operation.inputs[0].value)
        .set(
          "inputs.1.operations",
          operation.inputs[1].operations.map(convertToLargeOperation)
        );
      break;
  }
  return chainedOperation.value();
};

export const convertToSmallOperation = (
  operation: LargeOperation
): SmallOperation => {
  switch (operation.type) {
    case "open":
    case "click":
      return {
        type: operation.type,
        inputs: [
          {
            type: "text",
            value: operation.inputs[0].value
          }
        ]
      };
    case "extract":
      return {
        type: operation.type,
        inputs: [
          {
            type: "text",
            value: operation.inputs[0].value
          },
          {
            type: "text",
            value: operation.inputs[1].value
          },
          {
            type: "select",
            value: operation.inputs[2].value
          }
        ]
      };
    case "type":
    case "increase":
    case "decrease":
      return {
        type: operation.type,
        inputs: [
          {
            type: "text",
            value: operation.inputs[0].value
          },
          {
            type: "text",
            value: operation.inputs[1].value
          }
        ]
      };
    case "set":
      return {
        type: operation.type,
        inputs: [
          {
            type: "text",
            value: operation.inputs[0].value
          },
          {
            type: "select",
            value: operation.inputs[1].value
          },
          {
            type: "text",
            value: operation.inputs[2].value
          }
        ]
      };
    case "if":
    case "while":
      return {
        type: operation.type,
        inputs: [
          {
            type: "text",
            value: operation.inputs[0].value
          },
          {
            type: "operation_box",
            operations: operation.inputs[1].operations.map(
              convertToSmallOperation
            )
          }
        ]
      };
  }
};

export const isOperationValid = (operation: LargeOperation) =>
  operation.inputs.some((input) => "error" in input && !input.error);

export const validateValueWithRules = (
  value: string,
  rules: ValidationRule[]
) => {
  for (let i = 0; i < rules.length; i += 1) {
    const validate = VALIDATION_FUNCTION[rules[i].type];
    if (validate && !validate(value)) {
      return rules[i].message;
    }
  }
  return "";
};
