import { ScriptEditorState } from "../types/scriptEditor";
import { INITIAL_INFORMATION } from "./information";

export const INITIAL_SCRIPT_EDITOR_STATE: ScriptEditorState = {
  scriptId: "",
  information: INITIAL_INFORMATION,
  operations: [],
  selector: {
    visible: false,
    activePath: ""
  }
};
