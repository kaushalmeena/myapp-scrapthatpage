import store from "../redux/store";

export type StoreRootState = ReturnType<typeof store.getState>;

export type StoreRootDispatch = typeof store.dispatch;
