import { NotificationState } from "./notification";
import { ScriptEditorState } from "./scriptEditor";
import { SettingsState } from "./settings";

export type RootState = {
  notification: NotificationState;
  settings: SettingsState;
  scriptEditor: ScriptEditorState;
};
