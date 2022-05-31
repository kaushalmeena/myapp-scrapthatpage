import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { hideNotification } from "../notificationSlice";

function AppNotification() {
  const dispatch = useAppDispatch();
  const notification = useAppSelector((state) => state.notification);

  const handleSnackbarClose = () => dispatch(hideNotification());

  return (
    <Snackbar
      open={notification.visible}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      onClose={handleSnackbarClose}
    >
      <Alert variant="filled" severity={notification.severity}>
        {notification.message}
      </Alert>
    </Snackbar>
  );
}

export default AppNotification;
