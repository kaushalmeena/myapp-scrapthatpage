import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { notificationReducer } from "./notification";
import { scriptEditorReducer } from "./scriptEditor";
import { settingsReducer } from "./settings";

const rootReducer = combineReducers({
  notification: notificationReducer,
  settings: settingsReducer,
  scriptEditor: scriptEditorReducer
});

const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["settings"]
};

const persistedRootReducer = persistReducer(rootPersistConfig, rootReducer);

export default persistedRootReducer;
