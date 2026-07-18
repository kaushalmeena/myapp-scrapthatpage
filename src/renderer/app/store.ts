import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { scriptEditorReducer } from "@/features/editor/scriptEditorSlice";
import { settingsReducer } from "@/features/settings/settingsSlice";

const rootReducer = combineReducers({
  scriptEditor: scriptEditorReducer,
  settings: settingsReducer
});

const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
