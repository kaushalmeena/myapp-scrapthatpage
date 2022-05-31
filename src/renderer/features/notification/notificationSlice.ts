/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INITIAL_NOTIFICATION_STATE } from "./constants";
import { ShowNotificationActionPayload } from "./types";

const notificationSlice = createSlice({
  name: "notification",
  initialState: INITIAL_NOTIFICATION_STATE,
  reducers: {
    showNotification(
      state,
      action: PayloadAction<ShowNotificationActionPayload>
    ) {
      const { message, severity } = action.payload;
      state.visible = true;
      state.message = message;
      state.severity = severity;
    },
    hideNotification(state) {
      state.visible = false;
    }
  }
});

export const { showNotification, hideNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
