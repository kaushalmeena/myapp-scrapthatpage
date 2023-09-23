import { AlertColor } from "@mui/material";
import { useDispatch } from "react-redux";
import { showNotification } from "../redux/slices/notificationSlice";

type HookReturnType = {
  show: (message: string, severity: AlertColor) => void;
};

export const useNotification = (): HookReturnType => {
  const dispatch = useDispatch();

  const show = (message: string, severity: AlertColor) => {
    dispatch(showNotification({ message, severity }));
  };

  return {
    show
  };
};
