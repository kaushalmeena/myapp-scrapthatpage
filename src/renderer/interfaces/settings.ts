import { THEME_TYPES } from "../constants/themes";

export interface ISettings {
  theme: THEME_TYPES;
}

export interface ISettingsContext {
  settings: ISettings;
  setSettings: (settings: ISettings) => void;
}
