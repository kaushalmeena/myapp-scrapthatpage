import { useEffect, useState } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  DatabaseFetchHook,
  DatabaseFetchParams,
  FetchStatus
} from "../types/database";
import { StoreRootDispatch, StoreRootState } from "../types/store";

export const useAppDispatch = () => useDispatch<StoreRootDispatch>();

export const useAppSelector: TypedUseSelectorHook<StoreRootState> = useSelector;

export const useDatabaseFetch = <T>({
  fetcher,
  defaultValue,
  onSuccess,
  onError
}: DatabaseFetchParams<T>): DatabaseFetchHook<T> => {
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
