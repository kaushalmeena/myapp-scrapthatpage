import { IInformation } from "./information";
import { IOperationLarge } from "./operations";

export interface IOperationSelector {
  visible: boolean;
  activePath: string;
}

export interface IScriptEditorState {
  id: string;
  activeTab: number;
  information: IInformation;
  operations: IOperationLarge[];
  selector: IOperationSelector;
}
