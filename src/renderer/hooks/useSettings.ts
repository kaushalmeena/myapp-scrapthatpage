import { useContext } from "react";
import { SettingsContext } from "../context/Settings";
import { SettingsInterface } from "../types/settings";

export const useSettings = (): SettingsInterface => {
  const { settings, setSettings } = useContext(SettingsContext);
  return { settings, setSettings };
};
