import { wrap } from "object-path-immutable";
import { NOTIFICATION_ACTIONS } from "../actions/notification";
import { INTIAL_NOTIFICATION_STATE } from "../constants/notification";
import { NotificationAction, NotificationState } from "../types/notification";

export const notificationReducer = (
  state = INTIAL_NOTIFICATION_STATE,
  action: NotificationAction
): NotificationState => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.NOTIFICATION_SHOW: {
      const message = action.payload.message;
      const severity = action.payload.severity;
      return wrap(state)
        .set("visible", true)
        .set("message", message)
        .set("severity", severity)
        .value();
    }
    case NOTIFICATION_ACTIONS.NOTIFICATION_HIDE: {
      return wrap(state).set("visible", false).value();
    }
    default:
  }
  return state;
};
