import { AlertColor } from "@mui/material";
import { NOTIFICATION_ACTIONS } from "../actions/notification";

export type NotificationInterface = {
  show: (message: string, severity: AlertColor) => void;
};

export type NotificationOpenAction = {
  type: NOTIFICATION_ACTIONS.NOTIFICATION_SHOW;
  payload: {
    message: string;
    severity: AlertColor;
  };
};

export type NotificationCloseAction = {
  type: NOTIFICATION_ACTIONS.NOTIFICATION_HIDE;
};

export type NotificationState = {
  visible: boolean;
  message: string;
  severity: AlertColor;
};

export type NotificationAction =
  | NotificationOpenAction
  | NotificationCloseAction;
