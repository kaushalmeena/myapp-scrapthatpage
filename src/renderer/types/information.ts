import { ValidationRule } from "../../common/types/validation";

type InformationField = {
  value: string;
  error: string;
  rules: ValidationRule[];
};

export type Information = {
  name: InformationField;
  description: InformationField;
};
