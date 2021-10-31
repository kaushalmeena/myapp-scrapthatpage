import { THEME_TYPES } from "../constants/themes";

export type Settings = {
  theme: THEME_TYPES;
};

export type SettingsInterface = {
  settings: Settings;
  setSettings: (key: string, value: string | number) => void;
};
