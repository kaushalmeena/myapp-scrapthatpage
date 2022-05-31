import { PromiseExtended } from "dexie";
import { useEffect, useState } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { DatabaseFetchHook, FetchStatus } from "../types/database";
import { StoreRootDispatch, StoreRootState } from "../types/store";

export const useAppDispatch = () => useDispatch<StoreRootDispatch>();

export const useAppSelector: TypedUseSelectorHook<StoreRootState> = useSelector;

export const useDatabaseFetch = <T>(
  fetcher: PromiseExtended<T | undefined>,
  defaultValue: T
): DatabaseFetchHook<T> => {
  const [status, setStatus] = useState<FetchStatus>("loading");
  const [result, setResult] = useState<T>(defaultValue);
  const [error, setError] = useState("");

  useEffect(() => {
    fetcher
      .then((response) => {
        if (response) {
          setResult(response);
          setStatus("loaded");
        } else {
          setError("Data not found in database.");
          setStatus("error");
        }
      })
      .catch(() => {
        setError("Error occurred while fetching.");
        setStatus("error");
      });
  }, []);

  return { status, error, result };
};
