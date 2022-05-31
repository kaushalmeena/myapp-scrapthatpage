import { PromiseExtended } from "dexie";

export type FetchStatus = "loading" | "loaded" | "error";

export type DatabaseFetchHook<T> = {
  status: FetchStatus;
  error: string;
  result: T;
};

export type DatabaseFetchParams<T> = {
  fetcher: PromiseExtended<T | undefined>;
  defaultValue: T;
  onSuccess?: (result: T) => void;
  onError?: (error: Error) => void;
};
