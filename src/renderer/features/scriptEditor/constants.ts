import { VALIDATION_TYPES } from "../../../common/constants/validation";
import {
  VARIABLE_PICKER_MODES,
  VARIABLE_TYPES
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
    filterType: VARIABLE_TYPES.ANY,
    updateMode: VARIABLE_PICKER_MODES.SET
  }
};
