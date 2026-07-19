import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";

const loadInitialTheme = (): Theme => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return "light";
};

export type SettingsState = {
  theme: Theme;
  // Show the scraper window while a script runs (false = headless run).
  showScraperWindow: boolean;
  // Pause inserted between operations, for politeness towards scraped sites.
  operationDelayMs: number;
};

const SCRAPER_SETTINGS_KEY = "scraperSettings";

type StoredScraperSettings = Pick<
  SettingsState,
  "showScraperWindow" | "operationDelayMs"
>;

const loadScraperSettings = (): StoredScraperSettings => {
  try {
    const stored = JSON.parse(
      localStorage.getItem(SCRAPER_SETTINGS_KEY) ?? "{}"
    );
    return {
      showScraperWindow:
        typeof stored.showScraperWindow === "boolean"
          ? stored.showScraperWindow
          : true,
      operationDelayMs:
        typeof stored.operationDelayMs === "number" &&
        stored.operationDelayMs >= 0
          ? stored.operationDelayMs
          : 0
    };
  } catch {
    return { showScraperWindow: true, operationDelayMs: 0 };
  }
};

const persistScraperSettings = (state: SettingsState) => {
  localStorage.setItem(
    SCRAPER_SETTINGS_KEY,
    JSON.stringify({
      showScraperWindow: state.showScraperWindow,
      operationDelayMs: state.operationDelayMs
    })
  );
};

const settingsSlice = createSlice({
  name: "settings",
  initialState: (): SettingsState => ({
    theme: loadInitialTheme(),
    ...loadScraperSettings()
  }),
  reducers: {
    updateTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      localStorage.setItem(THEME_STORAGE_KEY, action.payload);
    },
    updateShowScraperWindow(state, action: PayloadAction<boolean>) {
      state.showScraperWindow = action.payload;
      persistScraperSettings(state);
    },
    updateOperationDelayMs(state, action: PayloadAction<number>) {
      state.operationDelayMs = Math.max(0, action.payload);
      persistScraperSettings(state);
    }
  }
});

export const settingsReducer = settingsSlice.reducer;

export const { updateTheme, updateShowScraperWindow, updateOperationDelayMs } =
  settingsSlice.actions;

export const selectTheme = (state: RootState) => state.settings.theme;
export const selectShowScraperWindow = (state: RootState) =>
  state.settings.showScraperWindow;
export const selectOperationDelayMs = (state: RootState) =>
  state.settings.operationDelayMs;
