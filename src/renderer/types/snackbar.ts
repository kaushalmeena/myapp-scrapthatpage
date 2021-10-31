import { AlertColor } from "@mui/material";

export type SnackbarInterface = {
  showSnackbar: (message: string, severity: AlertColor) => void;
};
