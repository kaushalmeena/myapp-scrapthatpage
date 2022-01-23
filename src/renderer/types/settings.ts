import { SETTINGS_ACTIONS } from "../actions/settings";
import { THEME_TYPES } from "../constants/themes";

export type SettingsSetAction = {
  type: SETTINGS_ACTIONS.SETTINGS_SET;
  payload: {
    key: string;
    value: string | number;
  };
};

export type SettingsState = {
  theme: THEME_TYPES;
};

export type SettingsAction = SettingsSetAction;
