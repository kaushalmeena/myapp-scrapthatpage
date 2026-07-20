import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { scriptEditorReducer } from "@/features/editor/scriptEditorSlice";
import {
  loadSettings,
  saveSettings
} from "@/features/settings/settingsPersistence";
import { settingsReducer } from "@/features/settings/settingsSlice";

const rootReducer = combineReducers({
  scriptEditor: scriptEditorReducer,
  settings: settingsReducer
});

const store = configureStore({
  reducer: rootReducer,
  // Rehydrate persisted settings on startup.
  preloadedState: { settings: loadSettings() }
});

// Persist settings whenever they change. Immer keeps the slice reference stable
// across unrelated actions, so this only writes when settings actually change.
let lastSettings = store.getState().settings;
store.subscribe(() => {
  const settings = store.getState().settings;
  if (settings !== lastSettings) {
    lastSettings = settings;
    saveSettings(settings);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
