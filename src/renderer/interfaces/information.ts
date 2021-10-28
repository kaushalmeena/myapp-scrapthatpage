import { IValidationRule } from "./input";

export interface IInformation {
  name: IInformationData;
  description: IInformationData;
}

export interface IInformationData {
  value: string;
  error: string;
  rules: IValidationRule[];
}
