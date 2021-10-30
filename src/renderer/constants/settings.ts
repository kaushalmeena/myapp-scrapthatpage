import { Settings } from "../types/settings";
import { THEME_TYPES } from "./themes";

export enum SETTINGS_KEYS {
  Theme = "theme"
}

export const SETTINGS_KEY = "app_settings";

export const INITIAL_SETTINGS: Settings = {
  theme: THEME_TYPES.LIGHT
};
