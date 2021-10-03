import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React, { createContext, ReactNode } from "react";
import {
  SETTINGS_DEFAULT_VALUES,
  SETTINGS_KEY
} from "../../constants/settings";
import { DARK_THEME, LIGHT_THEME } from "../../constants/themes";
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
  const [value, setValue] = useLocalForage<ISettings>(
    SETTINGS_KEY,
    SETTINGS_DEFAULT_VALUES
  );
  const theme = value.darkMode ? DARK_THEME : LIGHT_THEME;
  return (
    <SettingsContext.Provider
      value={{ settings: value, setSettings: setValue }}
    >
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </SettingsContext.Provider>
  );
};

export const SettingsConsumer = SettingsContext.Consumer;
