import { ISettings } from "../interfaces/settings";

export const SETTINGS_KEY = "app_settings";

export const SETTINGS_DEFAULT_VALUES: ISettings = {
  theme: "light"
};

export enum SETTINGS_KEYS {
  Theme = "theme"
}
