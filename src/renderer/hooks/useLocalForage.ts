import { useState, useEffect } from "react";
import localForage from "localforage";

export function useLocalForage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    localForage
      .getItem<T>(key)
      .then((value) => {
        setStoredValue(value || initialValue);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const setValue = (value: T) => {
    localForage
      .setItem<T>(key, value)
      .then(() => {
        setStoredValue(value);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return [storedValue, setValue];
}
