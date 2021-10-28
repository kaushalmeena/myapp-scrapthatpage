import { IScriptEditorState } from "../interfaces/scriptEditor";
import { initialInformationState } from "./information";

export const initialScriptEditorState: IScriptEditorState = {
  id: "",
  activeTab: 0,
  information: initialInformationState,
  operations: [],
  selector: {
    visible: false,
    activePath: ""
  }
};
