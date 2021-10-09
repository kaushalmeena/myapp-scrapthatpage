export interface ISettings {
  theme: string;
}

export interface ISettingsContext {
  settings: ISettings;
  setSettings: (settings: ISettings) => void;
}
