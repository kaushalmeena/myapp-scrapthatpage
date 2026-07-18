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
import { scriptEditorReducer } from "@/features/editor/scriptEditorSlice";
import { settingsReducer } from "@/features/settings/settingsSlice";

const rootReducer = combineReducers({
  scriptEditor: scriptEditorReducer,
  settings: settingsReducer
});

const persistConfig = {
  key: "root",
  storage,
  // Only settings (theme) survive restarts; editor state is per-session.
  whitelist: ["settings"]
};

const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
