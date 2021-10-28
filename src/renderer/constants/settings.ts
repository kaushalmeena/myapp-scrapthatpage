import { ISettings } from "../interfaces/settings";
import { THEME_TYPES } from "./themes";

export enum SETTINGS_KEYS {
  Theme = "theme"
}

export const SETTINGS_KEY = "app_settings";

export const initialSettings: ISettings = {
  theme: THEME_TYPES.LIGHT
};
