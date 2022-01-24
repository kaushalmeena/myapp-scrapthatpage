import { SettingsSetAction } from "../types/settings";

export const enum SETTINGS_ACTIONS {
  SETTINGS_SET = "SETTINGS_SET"
}

export const setSettings = (
  key: string,
  value: string | number
): SettingsSetAction => ({
  type: SETTINGS_ACTIONS.SETTINGS_SET,
  payload: {
    key,
    value
  }
});
