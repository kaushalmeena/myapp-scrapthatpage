import { VALIDATION_TYPES } from "./validation";

export const INITIAL_INFORMATION = {
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
