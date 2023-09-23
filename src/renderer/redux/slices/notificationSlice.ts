import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StoreRootState } from "../../types/store";
import { AlertColor } from "@mui/material";

export type NotificationState = {
  visible: boolean;
  message: string;
  severity: AlertColor;
};

export const initialNotificationState: NotificationState = {
  visible: false,
  message: "",
  severity: "success"
};

const notificationSlice = createSlice({
  name: "notification",
  initialState: initialNotificationState,
  reducers: {
    showNotification(
      state,
      action: PayloadAction<{
        message: string;
        severity: AlertColor;
      }>
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

export const notificationReducer = notificationSlice.reducer;

export const { showNotification, hideNotification } = notificationSlice.actions;

export const selectNotification = (state: StoreRootState) => state.notification;
