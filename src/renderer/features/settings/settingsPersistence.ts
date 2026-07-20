import { DEFAULT_SETTINGS, type SettingsState } from "./settingsSlice";

// Lightweight redux-persist: the whole settings slice is saved under one key
// and reloaded as the store's preloaded state. Wired up in app/store.ts via a
// subscription so the slice's reducers can stay pure.
const STORAGE_KEY = "settings";

// Reads persisted settings, falling back to defaults for anything missing or
// malformed so a corrupt/partial record can never crash startup.
export const loadSettings = (): SettingsState => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    return {
      theme: stored.theme === "dark" ? "dark" : "light",
      showWindow:
        typeof stored.showWindow === "boolean"
          ? stored.showWindow
          : DEFAULT_SETTINGS.showWindow,
      stepDelayMs:
        typeof stored.stepDelayMs === "number" && stored.stepDelayMs >= 0
          ? stored.stepDelayMs
          : DEFAULT_SETTINGS.stepDelayMs
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: SettingsState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};
