import { IInformation } from "../interfaces/information";
import { VALIDATION_TYPES } from "./input";

export const initialInformationState: IInformation = {
  name: {
    value: "",
    error: "",
    rules: [
      {
        type: VALIDATION_TYPES.REQUIRED,
        message: "Please enter name."
      }
    ]
  },
  description: {
    value: "",
    error: "",
    rules: [
      {
        type: VALIDATION_TYPES.REQUIRED,
        message: "Please enter description."
      }
    ]
  }
};
