import { ScriptEditorState } from "../types/scriptEditor";
import { VALIDATION_TYPES } from "../../common/constants/validation";

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
  selector: {
    operation: {
      visible: false,
      activePath: ""
    },
    variable: {
      visible: false,
      activePath: "",
      filterType: "*",
      updateMode: "SET"
    }
  }
};
