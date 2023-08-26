import { PromiseExtended } from "dexie";
import { useState, useEffect } from "react";

type FetchStatus = "loading" | "loaded" | "error";

type HookParams<T> = {
  fetcher: PromiseExtended<T | undefined>;
  defaultValue: T;
  onSuccess?: (result: T) => void;
  onError?: (error: Error) => void;
};

type HookReturnType<T> = {
  status: FetchStatus;
  error: string;
  result: T;
};

export const useDexieFetch = <T>({
  fetcher,
  defaultValue,
  onSuccess,
  onError
}: HookParams<T>): HookReturnType<T> => {
  const [status, setStatus] = useState<FetchStatus>("loading");
  const [result, setResult] = useState<T>(defaultValue);
  const [error, setError] = useState("");

  useEffect(() => {
    fetcher
      .then((res) => {
        if (res) {
          setResult(res);
          setStatus("loaded");
          onSuccess?.(res);
        } else {
          throw new Error("Record not found in database");
        }
      })
      .catch((err) => {
        setError("Error occurred while fetching.");
        setStatus("error");
        onError?.(err);
      });
  }, []);

  return { status, error, result };
};
