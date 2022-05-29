import { AlertColor } from "@mui/material";
import { useDispatch } from "react-redux";
import { showNotification } from "./notificationSlice";
import { NotificationHook } from "./types";

export const useNotification = (): NotificationHook => {
  const dispatch = useDispatch();

  const show = (message: string, severity: AlertColor) => {
    dispatch(showNotification({ message, severity }));
  };

  return {
    show
  };
};
