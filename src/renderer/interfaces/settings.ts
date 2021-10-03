export interface ISettings {
  darkMode: boolean;
}

export interface ISettingsContext {
  settings: ISettings;
  setSettings: (settings: ISettings) => void;
}