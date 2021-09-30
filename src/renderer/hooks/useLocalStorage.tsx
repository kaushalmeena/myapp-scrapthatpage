import { useState } from "react";

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((value: T) => T)) => void] {
  const getValue = () => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  }

  const [storedValue, setStoredValue] = useState<T>(getValue);

  const setValue = (value: T | ((value: T) => T)) => {
    if (typeof window == 'undefined') {
      console.warn(`Tried setting localStorage key '${key}' even though environment is not a client.`)
    }

    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;