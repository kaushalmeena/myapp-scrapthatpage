import { VALIDATION_REGEXES } from "../constants/input";
import { OPERTAIONS } from "../constants/operations";
import { IValidationRule } from "../interfaces/input";
import {
  IOperationData,
  IOperationLarge,
  IOperationSmall
} from "../interfaces/operations";

export const convertToLargeOperations = (
  operations: IOperationSmall[]
): IOperationLarge[] => {
  const result: IOperationLarge[] = [];
  for (let i = 0; i < operations.length; i++) {
    const temp = OPERTAIONS[operations[i].type];
    for (let j = 0; j < temp.data.length; j++) {
      temp.data[j].value = operations[i].data[j];
    }
    result.push(temp);
  }
  return result;
};

export const formatHeading = (format: string, data: IOperationData[]): string =>
  format.replace(
    /{[\w-]+}/g,
    (match: string) =>
      data[Number.parseInt(match.slice(1, -1))].value || "undefined"
  );

export const validateInput = (
  value: string,
  rules: IValidationRule[]
): string => {
  for (let i = 0; i < rules.length; i++) {
    const regex = VALIDATION_REGEXES[rules[i].type];
    if (regex && !regex.test(value)) {
      return rules[i].message;
    }
  }
  return "";
};
