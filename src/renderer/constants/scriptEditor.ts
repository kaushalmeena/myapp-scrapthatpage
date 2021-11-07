import { ScriptEditorState } from "../types/scriptEditor";
import { INITIAL_INFORMATION } from "./information";

export const INITIAL_SCRIPT_EDITOR_STATE: ScriptEditorState = {
  favorite: 0,
  information: INITIAL_INFORMATION,
  operations: [],
  selector: {
    operation: {
      visible: false,
      activePath: ""
    },
    variable: {
      visible: false,
      activePath: "",
      appendMode: true
    }
  }
};
