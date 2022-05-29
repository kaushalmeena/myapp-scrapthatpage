import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { NotificationState } from "../features/notification/types";
import { ScriptEditorState } from "../features/scriptEditor/types";
import { SettingsState } from "../features/settings/types";

export type StoreRootState = {
  notification: NotificationState;
  settings: SettingsState;
  scriptEditor: ScriptEditorState;
};

export type StoreRootDispatch = ThunkDispatch<
  StoreRootState,
  undefined,
  AnyAction
>;
