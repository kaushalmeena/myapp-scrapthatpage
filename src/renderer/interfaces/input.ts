import { VALIDATION_TYPES } from "../constants/input";

export interface IValidationRule {
  type: VALIDATION_TYPES;
  message: string;
}
