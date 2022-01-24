import { wrap } from "object-path-immutable";
import { SETTINGS_ACTIONS } from "../actions/settings";
import { INITIAL_SETTINGS_STATE } from "../constants/settings";
import { SettingsAction, SettingsState } from "../types/settings";

export const settingsReducer = (
  state = INITIAL_SETTINGS_STATE,
  action: SettingsAction
): SettingsState => {
  switch (action.type) {
    case SETTINGS_ACTIONS.SETTINGS_SET: {
      const key = action.payload.key;
      const value = action.payload.value;
      return wrap(state).set(key, value).value();
    }
    default:
  }
  return state;
};
