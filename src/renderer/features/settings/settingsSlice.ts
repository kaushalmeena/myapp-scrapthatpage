import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INITIAL_SETTINGS_STATE } from "./constants";
import { UpdateThemeActionPayload } from "./types";

const settingsSlice = createSlice({
  name: "settings",
  initialState: INITIAL_SETTINGS_STATE,
  reducers: {
    updateTheme(state, action: PayloadAction<UpdateThemeActionPayload>) {
      const { theme } = action.payload;
      state.theme = theme;
    }
  }
});

export const { updateTheme } = settingsSlice.actions;

export default settingsSlice.reducer;
