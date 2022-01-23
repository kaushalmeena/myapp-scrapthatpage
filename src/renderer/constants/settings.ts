import { SettingsState } from "../types/settings";
import { THEME_TYPES } from "./themes";

export const enum SETTINGS_KEYS {
  THEME = "theme"
}

export const INITIAL_SETTINGS_STATE: SettingsState = {
  theme: THEME_TYPES.LIGHT
};
