import { ThemeTypes } from "../../constants/themes";

// Settings state types
export type SettingsState = {
  theme: ThemeTypes;
};

// Settings payload types
export type UpdateThemeActionPayload = {
  theme: ThemeTypes;
};
