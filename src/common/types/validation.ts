import { VALIDATION_TYPES } from "../constants/validation";

export type ValidationRule = {
  type: VALIDATION_TYPES;
  message: string;
};
