import { Dispatch } from "react";
import { NotificationState, NotificationAction } from "./notification";
import { ScriptEditorAction, ScriptEditorState } from "./scriptEditor";
import { SettingsAction, SettingsState } from "./settings";

export type StoreRootState = {
  notification: NotificationState;
  settings: SettingsState;
  scriptEditor: ScriptEditorState;
};

export type StoreRootAction =
  | NotificationAction
  | SettingsAction
  | ScriptEditorAction;

export type StoreRootDispatch = Dispatch<StoreRootAction>;
