import { createStore } from "redux";
import { persistStore } from "redux-persist";
import persistedRootReducer from "../reducers";

export const store = createStore(persistedRootReducer);

export const persistor = persistStore(store);
