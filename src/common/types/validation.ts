import { ValidationTypes } from "../constants/validation";

export type ValidationRule = {
  type: ValidationTypes;
  message: string;
};

export type ValidationFunction = {
  [key: string]: (value: string) => boolean;
};
