export type FetchStatus = "loading" | "loaded" | "error";

export type DatabaseFetchHook<T> = {
  status: FetchStatus;
  error: string;
  result: T;
};
