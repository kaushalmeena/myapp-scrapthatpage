import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { notificationReducer } from "../reducers/notification";
import { scriptEditorReducer } from "../reducers/scriptEditor";
import { settingsReducer } from "../reducers/settings";

const rootReducer = combineReducers({
  notification: notificationReducer,
  settings: settingsReducer,
  scriptEditor: scriptEditorReducer
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["settings"] // Whitelist (Save Specific Reducers)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);

export const persistor = persistStore(store);
