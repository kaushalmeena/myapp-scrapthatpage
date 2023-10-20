import { Alert, Snackbar } from "@mui/material";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  hideNotification,
  selectNotification
} from "../../redux/slices/notificationSlice";

function Notification() {
  const dispatch = useAppDispatch();
  const notification = useAppSelector(selectNotification);

  const handleSnackbarClose = () => dispatch(hideNotification());

  return (
    <Snackbar
      open={notification.visible}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      onClose={handleSnackbarClose}
    >
      <Alert
        variant="filled"
        severity={notification.severity}
        sx={{
          whiteSpace: "pre-line"
        }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
}

export default Notification;
