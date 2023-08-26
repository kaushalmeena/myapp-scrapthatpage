import store from "../store";

export type StoreRootState = ReturnType<typeof store.getState>;

export type StoreRootDispatch = typeof store.dispatch;
