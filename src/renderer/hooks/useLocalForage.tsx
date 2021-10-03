import { useState, useEffect, useCallback } from "react";
import localForage from "localforage";

export function useLocalForage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    async function get() {
      try {
        const value = await localForage.getItem<T>(key);
        setStoredValue(value == null ? initialValue : value);
      } catch (err) {
        console.log(err);
      }
    }
    get();
  }, []);

  const setValue = useCallback(
    (value: T) => {
      async function set(value: T) {
        try {
          setStoredValue(value);
          await localForage.setItem<T>(key, value);
        } catch (err) {
          console.log(err);
        }
      }
      set(value);
    },
    [key]
  );

  return [storedValue, setValue];
}
