import { ValidationTypes } from "../../../common/constants/validation";
import {
  VariablePickerModes,
  VariableTypes
} from "../../../common/constants/variable";
import { ScriptEditorState } from "./types";

export const INITIAL_SCRIPT_EDITOR_STATE: ScriptEditorState = {
  favorite: 0,
  information: {
    name: {
      value: "",
      error: "",
      rules: [
        {
          type: ValidationTypes.REQUIRED,
          message: "Please enter name."
        }
      ]
    },
    description: {
      value: "",
      error: "",
      rules: [
        {
          type: ValidationTypes.REQUIRED,
          message: "Please enter description."
        }
      ]
    }
  },
  operations: [],
  variables: [],
  operationSelector: {
    visible: false,
    activePath: ""
  },
  variableSelector: {
    visible: false,
    activePath: "",
    filterType: VariableTypes.ANY,
    updateMode: VariablePickerModes.SET
  }
};
