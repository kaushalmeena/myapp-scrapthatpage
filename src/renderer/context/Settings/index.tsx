import { createTheme } from "@mui/material";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React, { createContext, ReactNode } from "react";
import {
  SETTINGS_DEFAULT_VALUES,
  SETTINGS_KEY
} from "../../constants/settings";
import { THEMES } from "../../constants/themes";
import { useLocalForage } from "../../hooks/useLocalForage";
import { ISettings, ISettingsContext } from "../../interfaces/settings";

export const SettingsContext = createContext<ISettingsContext>({
  settings: SETTINGS_DEFAULT_VALUES,
  setSettings: () => null
});

type SettingsProviderProps = {
  children?: ReactNode;
};

export const SettingsProvider = (props: SettingsProviderProps): JSX.Element => {
  const [settings, setSettings] = useLocalForage<ISettings>(
    SETTINGS_KEY,
    SETTINGS_DEFAULT_VALUES
  );
  const theme = THEMES[settings.theme];
  const muiTheme = createTheme(theme);
  return (
    <SettingsContext.Provider
      value={{ settings: settings, setSettings: setSettings }}
    >
      <ThemeProvider theme={muiTheme}>{props.children}</ThemeProvider>
    </SettingsContext.Provider>
  );
};

export const SettingsConsumer = SettingsContext.Consumer;
