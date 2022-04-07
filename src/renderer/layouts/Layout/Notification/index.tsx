import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideNotification } from "../../../actions/notification";
import { StoreRootState } from "../../../types/store";

export const Notification = (): JSX.Element => {
  const dispatch = useDispatch();

  const notification = useSelector(
    (state: StoreRootState) => state.notification
  );

  const handleSnackbarClose = () => {
    dispatch(hideNotification());
  };

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
};

export default Notification;