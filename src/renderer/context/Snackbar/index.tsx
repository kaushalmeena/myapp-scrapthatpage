import { Alert, AlertColor, Snackbar } from "@mui/material";
import React, { createContext, ReactNode, useState } from "react";
import { SnackbarInterface } from "../../types/snackbar";

export const SnackbarContext = createContext<SnackbarInterface>({
  show: () => null
});

type SnackbarProviderProps = {
  children?: ReactNode;
};

export const SnackbarProvider = (props: SnackbarProviderProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("success");

  const handleSnackbarOpen = (
    snackbarMessage: string,
    snackbarSeverity: AlertColor = "success"
  ) => {
    setMessage(snackbarMessage);
    setSeverity(snackbarSeverity);
    setOpen(true);
  };

  const handleSnackbarClose = () => {
    setOpen(false);
  };

  const contextValue = {
    show: handleSnackbarOpen
  };

  return (
    <SnackbarContext.Provider value={contextValue}>
      {props.children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={handleSnackbarClose}
      >
        <Alert variant="filled" severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const SnackbarConsumer = SnackbarContext.Consumer;
