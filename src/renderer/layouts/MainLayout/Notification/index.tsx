import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux";
import { hideNotification } from "../../../actions/notification";
import { NotificationState } from "../../../types/notification";
import { StoreRootDispatch, StoreRootState } from "../../../types/store";

type NotificationStateProps = {
  notification: NotificationState;
};

type NotificationDispatchProps = {
  handleSnackbarClose: () => void;
};

type NotificationOwnProps = Record<string, never>;

type NotificationProps = NotificationStateProps &
  NotificationDispatchProps &
  NotificationOwnProps;

export const Notification = (props: NotificationProps): JSX.Element => {
  return (
    <Snackbar
      open={props.notification.visible}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      onClose={props.handleSnackbarClose}
    >
      <Alert variant="filled" severity={props.notification.severity}>
        {props.notification.message}
      </Alert>
    </Snackbar>
  );
};

const mapStateToProps: MapStateToProps<
  NotificationStateProps,
  NotificationOwnProps,
  StoreRootState
> = (state) => ({
  notification: state.notification
});

const mapDispatchToProps: MapDispatchToProps<
  NotificationDispatchProps,
  NotificationOwnProps
> = (dispatch: StoreRootDispatch) => ({
  handleSnackbarClose: () => dispatch(hideNotification())
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
