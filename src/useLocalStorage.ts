// From https://github.com/dance2die/react-use-localstorage
import React from 'react';

export default function useLocalStorage(
  key: string,
  initialValue: string = '',
): [string, any] {
  const [item, setValue] = React.useState(() => {
    let value;

    // Try to parse the value and fall back to value
    try {
      value = JSON.parse(localStorage.getItem(key) || '');
    } catch (err) {
      value = localStorage.getItem(key);
    }

    value = value || initialValue;
    localStorage.setItem(
      key,
      typeof value === 'string' ? value : JSON.stringify(value),
    );
    return value;
  });

  const setItem = (newValue: any) => {
    setValue(newValue);
    localStorage.setItem(
      key,
      typeof newValue === 'string' ? newValue : JSON.stringify(newValue),
    );
  };

  return [item, setItem];
}
