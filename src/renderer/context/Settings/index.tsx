import { createTheme } from "@mui/material";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React, { createContext, ReactNode } from "react";
import { INITIAL_SETTINGS, SETTINGS_KEY } from "../../constants/settings";
import { THEMES } from "../../constants/themes";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Settings, SettingsInterface } from "../../types/settings";

export const SettingsContext = createContext<SettingsInterface>({
  settings: INITIAL_SETTINGS,
  setSettings: () => null
});

type SettingsProviderProps = {
  children?: ReactNode;
};

export const SettingsProvider = (props: SettingsProviderProps): JSX.Element => {
  const [settings, setSettings] = useLocalStorage<Settings>(
    SETTINGS_KEY,
    INITIAL_SETTINGS
  );

  const theme = THEMES[settings.theme].data;
  const muiTheme = createTheme(theme);

  const handleSettingsChange = (key: string, value: string | number) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <SettingsContext.Provider
      value={{ settings: settings, setSettings: handleSettingsChange }}
    >
      <ThemeProvider theme={muiTheme}>{props.children}</ThemeProvider>
    </SettingsContext.Provider>
  );
};

export const SettingsConsumer = SettingsContext.Consumer;
