import { Settings } from "../types/settings";
import { THEME_TYPES } from "./themes";

export const enum SETTINGS_KEYS {
  THEME = "theme"
}

export const INITIAL_SETTINGS: Settings = {
  theme: THEME_TYPES.LIGHT
};
