import { ValidationTypes } from "../constants/validation";

export type ValidationRule = {
  type: ValidationTypes;
  message: string;
};
