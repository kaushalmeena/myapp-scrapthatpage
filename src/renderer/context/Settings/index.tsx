import MuiThemeProvider from "@mui/material/styles/ThemeProvider";
import React, { createContext, ReactNode } from "react";
import { SETTINGS_DEFAULT_VALUES, SETTINGS_KEY } from "../../constants/settings";
import THEMES from "../../constants/themes";
import useLocalStorage from "../../hooks/useLocalStorage";
import { ISettings, ISettingsContext } from "../../interfaces/settings";

export const SettingsContext = createContext<ISettingsContext | null>(null);

type SettingsProviderProps = {
  children?: ReactNode;
};

export const SettingsProvider = (props: SettingsProviderProps) => {
  const [settings, setSettings] = useLocalStorage<ISettings>(SETTINGS_KEY, SETTINGS_DEFAULT_VALUES);
  const MuiTheme = THEMES[settings.theme];
  return (
    <SettingsContext.Provider value={{ settings: settings, setSettings: setSettings }}>
      <MuiThemeProvider theme={MuiTheme}>
        {props.children}
      </MuiThemeProvider>
    </SettingsContext.Provider>
  );
}

export const SettingsConsumer = SettingsContext.Consumer;
