import { THEME_TYPES } from "../../constants/themes";

// Settings state types
export type SettingsState = {
  theme: THEME_TYPES;
};

// Settings payload types
export type UpdateThemeActionPayload = {
  theme: THEME_TYPES;
};
