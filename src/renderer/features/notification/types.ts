import { AlertColor } from "@mui/material";

// Notification state types
export type NotificationState = {
  visible: boolean;
  message: string;
  severity: AlertColor;
};

// Notification payload types
export type ShowNotificationActionPayload = {
  message: string;
  severity: AlertColor;
};

// Notification hook types
export type NotificationHook = {
  show: (message: string, severity: AlertColor) => void;
};
