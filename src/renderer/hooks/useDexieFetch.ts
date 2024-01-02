import { PromiseExtended } from "dexie";
import { useState, useEffect, useCallback, useRef } from "react";

type FetchStatus = "loading" | "loaded" | "error";

type HookParams<T> = {
  fetcher: () => PromiseExtended<T | undefined>;
  defaultValue: T;
  onSuccess?: (result: T) => void;
  onError?: (error: Error) => void;
};

type HookReturnType<T> = {
  status: FetchStatus;
  error: string;
  result: T;
  reload: () => void;
};

export const useDexieFetch = <T>(config: HookParams<T>): HookReturnType<T> => {
  const [status, setStatus] = useState<FetchStatus>("loading");
  const [result, setResult] = useState<T>(config.defaultValue);
  const [error, setError] = useState("");

  const hookConfigRef = useRef<HookParams<T>>(config);

  hookConfigRef.current = config;

  const fetchData = useCallback(() => {
    hookConfigRef.current
      .fetcher()
      .then((res) => {
        if (!res) {
          throw new Error("Record(s) not found in database");
        }
        setResult(res);
        setStatus("loaded");
        hookConfigRef.current?.onSuccess?.(res);
      })
      .catch((err) => {
        setError("Error occurred while fetching.");
        setStatus("error");
        hookConfigRef.current?.onError?.(err);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { status, error, result, reload: fetchData };
};
