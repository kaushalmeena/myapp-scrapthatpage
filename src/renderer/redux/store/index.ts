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
import { notificationReducer } from "../slices/notificationSlice";
import { scriptEditorReducer } from "../slices/scriptEditorSlice";
import { settingsReducer } from "../slices/settingsSlice";

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
