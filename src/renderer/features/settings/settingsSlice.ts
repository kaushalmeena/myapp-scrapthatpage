import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

export type ThemeType = "light" | "dark";

export type SettingsState = {
  theme: ThemeType;
};

export const initialSettingsState: SettingsState = {
  theme: "light"
};

const settingsSlice = createSlice({
  name: "settings",
  initialState: initialSettingsState,
  reducers: {
    updateTheme(state, action: PayloadAction<ThemeType>) {
      state.theme = action.payload;
    }
  }
});

export const settingsReducer = settingsSlice.reducer;

export const { updateTheme } = settingsSlice.actions;

export const selectTheme = (state: RootState) => state.settings.theme;
