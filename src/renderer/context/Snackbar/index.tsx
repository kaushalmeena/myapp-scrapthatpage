import { Alert, AlertColor, Snackbar } from "@mui/material";
import React, { createContext, ReactNode, useState } from "react";
import { SnackbarInterface } from "../../types/snackbar";

export const SnackbarContext = createContext<SnackbarInterface>({
  showSnackbar: () => null
});

type SnackbarProviderProps = {
  children?: ReactNode;
};

export const SnackbarProvider = (props: SnackbarProviderProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("success");

  const handleToastOpen = (
    snackbarMessage: string,
    snackbarSeverity: AlertColor = "success"
  ) => {
    setMessage(snackbarMessage);
    setSeverity(snackbarSeverity);
    setOpen(true);
  };

  const handleToastClose = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar: handleToastOpen }}>
      {props.children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleToastClose}
      >
        <Alert variant="filled" severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const SnackbarConsumer = SnackbarContext.Consumer;