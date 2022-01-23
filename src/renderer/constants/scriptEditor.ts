import { VALIDATION_TYPES } from "../../common/constants/validation";
import {
  VARIABLE_TYPES,
  VARIABLE_PICKER_MODES
} from "../../common/constants/variable";
import { ScriptEditorState } from "../types/scriptEditor";

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
  selector: {
    operation: {
      visible: false,
      activePath: ""
    },
    variable: {
      visible: false,
      activePath: "",
      filterType: VARIABLE_TYPES.ANY,
      updateMode: VARIABLE_PICKER_MODES.SET
    }
  }
};
