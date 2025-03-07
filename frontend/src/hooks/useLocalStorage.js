import { useState } from "react";

function useLocalStorage(key, initialValue = null) {
  const storedValue = localStorage.getItem(key);

  // Ensure we return null if the token is invalid
  const parsedValue = storedValue ? storedValue : initialValue;

  const [value, setValue] = useState(parsedValue);

  const setStoredValue = (newValue) => {
    if (newValue === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, newValue); // Store JWT as a string
    }
    setValue(newValue);
  };

  return [value, setStoredValue];
}

export default useLocalStorage;