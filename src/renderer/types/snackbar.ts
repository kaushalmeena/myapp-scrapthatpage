import { AlertColor } from "@mui/material";

export type SnackbarInterface = {
  show: (message: string, severity: AlertColor) => void;
};
