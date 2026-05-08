import { useState, useEffect } from 'react';

// Syncs a piece of state with localStorage.
// Works like useState but persists across page refreshes.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.warn(`Spine: could not save "${key}" to localStorage.`);
    }
  }, [key, value]);

  return [value, setValue];
}
