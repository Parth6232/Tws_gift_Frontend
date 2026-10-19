import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value
 * @param {*} value - The value to debounce
 * @param {number} delay - The debounce delay in milliseconds (default: 400ms)
 * @returns {*} The debounced value
 */
export function useDebouncedValue(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebouncedValue;
