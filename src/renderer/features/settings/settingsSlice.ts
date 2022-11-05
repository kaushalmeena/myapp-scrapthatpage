import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StoreRootState } from "../../types/store";
import { INITIAL_SETTINGS_STATE } from "./constants";

const settingsSlice = createSlice({
  name: "settings",
  initialState: INITIAL_SETTINGS_STATE,
  reducers: {
    updateTheme(state, action: PayloadAction<string>) {
      const theme = action.payload;
      state.theme = theme;
    }
  }
});

// Settings reducer
export const settingsReducer = settingsSlice.reducer;

// Settings actions
export const { updateTheme } = settingsSlice.actions;

// Settings selectors
export const selectSettings = (state: StoreRootState) => state.settings;
export const selectTheme = (state: StoreRootState) => state.settings.theme;
