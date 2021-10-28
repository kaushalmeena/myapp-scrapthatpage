import { INPUT_TYPES } from "../constants/input";
import { OPERATION_TYPES } from "../constants/operations";
import { IValidationRule } from "./input";

export interface IOperationLarge {
  name: string;
  type: OPERATION_TYPES;
  description: string;
  format: string;
  expanded: boolean;
  data: IOperationData[];
}

export interface IOperationSmall {
  type: OPERATION_TYPES;
  data: string[];
}

export interface IOperationData {
  label: string;
  type: INPUT_TYPES;
  width: number;
  value: string;
  error: string;
  rules: IValidationRule[];
}
