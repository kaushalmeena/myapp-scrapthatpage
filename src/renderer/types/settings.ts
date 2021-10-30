import { THEME_TYPES } from "../constants/themes";

export type Settings = {
  theme: THEME_TYPES;
};

export type SettingsContext = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
};
