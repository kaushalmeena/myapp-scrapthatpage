import { useContext } from "react";
import { SettingsContext } from "../context/Settings";
import { SettingsInterface } from "../types/settings";

export const useSettings = (): SettingsInterface => useContext(SettingsContext);
