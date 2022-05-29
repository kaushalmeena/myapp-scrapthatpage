import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import notificationReducer from "../features/notification/notificationSlice";
import scriptEditorReducer from "../features/scriptEditor/scriptEditorSlice";
import settingsReducer from "../features/settings/settingsSlice";

const rootReducer = combineReducers({
  notification: notificationReducer,
  scriptEditor: scriptEditorReducer,
  settings: settingsReducer
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["settings"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

export const persistor = persistStore(store);

export default store;
