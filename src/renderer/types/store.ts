import { NotificationState } from "./notification";
import { ScriptEditorState } from "./scriptEditor";
import { SettingsState } from "./settings";

export type StoreRootState = {
  notification: NotificationState;
  settings: SettingsState;
  scriptEditor: ScriptEditorState;
};
