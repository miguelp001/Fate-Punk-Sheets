import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T,>(key: string | null, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (key === null) return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading from localStorage: ${error}`);
      return initialValue;
    }
  });

  useEffect(() => {
    if (key === null) {
      setStoredValue(initialValue);
      return;
    }
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
       console.error(`Error reading from localStorage: ${error}`);
       setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  const setValue = useCallback((value: React.SetStateAction<T>) => {
    try {
      setStoredValue(currentStoredValue => {
        const valueToStore = value instanceof Function ? value(currentStoredValue) : value;
        if (key !== null) {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      });
    } catch (error) {
      console.error(`Error writing to localStorage: ${error}`);
    }
  }, [key]);
  
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === key) {
             try {
                setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
             } catch(err){
                console.error(`Error handling storage change: ${err}`);
             }
        }
    };
    if (key !== null) {
        window.addEventListener('storage', handleStorageChange);
    }
    return () => {
         if (key !== null) {
            window.removeEventListener('storage', handleStorageChange);
         }
    };
  }, [key, initialValue]);

  return [storedValue, setValue];
}
export default useLocalStorage;