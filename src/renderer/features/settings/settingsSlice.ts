import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

export type ThemeType = "light" | "dark";

const THEME_STORAGE_KEY = "theme";

const loadInitialTheme = (): ThemeType => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  // One-time migration from the redux-persist era, which stored settings
  // under "persist:root" as double-encoded JSON.
  try {
    const persisted = localStorage.getItem("persist:root");
    if (persisted) {
      const theme = JSON.parse(JSON.parse(persisted).settings).theme;
      localStorage.removeItem("persist:root");
      if (theme === "light" || theme === "dark") {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        return theme;
      }
    }
  } catch {
    // Fall through to the default when the legacy value is malformed.
  }
  return "light";
};

export type SettingsState = {
  theme: ThemeType;
};

const settingsSlice = createSlice({
  name: "settings",
  initialState: (): SettingsState => ({ theme: loadInitialTheme() }),
  reducers: {
    updateTheme(state, action: PayloadAction<ThemeType>) {
      state.theme = action.payload;
      localStorage.setItem(THEME_STORAGE_KEY, action.payload);
    }
  }
});

export const settingsReducer = settingsSlice.reducer;

export const { updateTheme } = settingsSlice.actions;

export const selectTheme = (state: RootState) => state.settings.theme;
