import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

export type Theme = "light" | "dark";

export type SettingsState = {
  theme: Theme;
  // Show the scraper window while a script runs (false = headless run).
  showWindow: boolean;
  // Pause inserted between steps, for politeness towards scraped sites.
  stepDelayMs: number;
};

export const DEFAULT_SETTINGS: SettingsState = {
  theme: "light",
  showWindow: true,
  stepDelayMs: 0
};

// Reducers stay pure; persistence to localStorage is handled centrally by a
// store subscription (see settingsPersistence.ts).
const settingsSlice = createSlice({
  name: "settings",
  initialState: DEFAULT_SETTINGS,
  reducers: {
    updateTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
    updateShowWindow(state, action: PayloadAction<boolean>) {
      state.showWindow = action.payload;
    },
    updateStepDelayMs(state, action: PayloadAction<number>) {
      state.stepDelayMs = Math.max(0, action.payload);
    }
  }
});

export const settingsReducer = settingsSlice.reducer;

export const { updateTheme, updateShowWindow, updateStepDelayMs } =
  settingsSlice.actions;

export const selectTheme = (state: RootState) => state.settings.theme;
export const selectShowWindow = (state: RootState) => state.settings.showWindow;
export const selectStepDelayMs = (state: RootState) =>
  state.settings.stepDelayMs;
