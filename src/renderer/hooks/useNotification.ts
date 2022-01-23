import { AlertColor } from "@mui/material";
import { useDispatch } from "react-redux";
import { showNotification } from "../actions/notification";
import { NotificationInterface } from "../types/notification";

export const useNotification = (): NotificationInterface => {
  const dispatch = useDispatch();

  const show = (message: string, severity: AlertColor) => {
    dispatch(showNotification(message, severity));
  };

  return {
    show
  };
};
