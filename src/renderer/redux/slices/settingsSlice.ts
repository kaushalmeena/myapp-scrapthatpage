import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StoreRootState } from "../../types/store";
import { ThemeType } from "../../types/theme";

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
      const theme = action.payload;
      state.theme = theme;
    }
  }
});

export const settingsReducer = settingsSlice.reducer;

export const { updateTheme } = settingsSlice.actions;

export const selectSettings = (state: StoreRootState) => state.settings;
export const selectTheme = (state: StoreRootState) => state.settings.theme;
