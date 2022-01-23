import { AlertColor } from "@mui/material";
import {
  NotificationCloseAction,
  NotificationOpenAction
} from "../types/notification";

export const enum NOTIFICATION_ACTIONS {
  NOTIFICATION_SHOW,
  NOTIFICATION_HIDE
}

export const showNotification = (
  message: string,
  severity: AlertColor
): NotificationOpenAction => ({
  type: NOTIFICATION_ACTIONS.NOTIFICATION_SHOW,
  payload: {
    message,
    severity
  }
});

export const hideNotification = (): NotificationCloseAction => ({
  type: NOTIFICATION_ACTIONS.NOTIFICATION_HIDE
});
