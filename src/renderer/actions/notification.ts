import { AlertColor } from "@mui/material";
import {
  NotificationHideAction,
  NotificationShowAction
} from "../types/notification";

export const enum NOTIFICATION_ACTIONS {
  NOTIFICATION_SHOW = "NOTIFICATION_SHOW",
  NOTIFICATION_HIDE = "NOTIFICATION_HIDE"
}

export const showNotification = (
  message: string,
  severity: AlertColor
): NotificationShowAction => ({
  type: NOTIFICATION_ACTIONS.NOTIFICATION_SHOW,
  payload: {
    message,
    severity
  }
});

export const hideNotification = (): NotificationHideAction => ({
  type: NOTIFICATION_ACTIONS.NOTIFICATION_HIDE
});
