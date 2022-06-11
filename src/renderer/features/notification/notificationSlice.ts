import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StoreRootState } from "../../types/store";
import { INITIAL_NOTIFICATION_STATE } from "./constants";
import { ShowNotificationActionPayload } from "./types";

const notificationSlice = createSlice({
  name: "notification",
  initialState: INITIAL_NOTIFICATION_STATE,
  reducers: {
    showNotification(
      draftState,
      action: PayloadAction<ShowNotificationActionPayload>
    ) {
      const { message, severity } = action.payload;
      draftState.visible = true;
      draftState.message = message;
      draftState.severity = severity;
    },
    hideNotification(draftState) {
      draftState.visible = false;
    }
  }
});

// Notification reducer
export const notificationReducer = notificationSlice.reducer;

// Notification actions
export const { showNotification, hideNotification } = notificationSlice.actions;

// Notification selectors
export const selectNotification = (state: StoreRootState) => state.notification;
