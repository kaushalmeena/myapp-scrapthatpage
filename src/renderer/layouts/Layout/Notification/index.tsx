import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideNotification } from "../../../actions/notification";
import { RootState } from "../../../types/store";

export const Notification = (): JSX.Element => {
  const dispatch = useDispatch();
  const notification = useSelector((state: RootState) => state.notification);

  const handleNotificationClose = () => {
    dispatch(hideNotification());
  };

  return (
    <Snackbar
      open={notification.visible}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      onClose={handleNotificationClose}
    >
      <Alert variant="filled" severity={notification.severity}>
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
