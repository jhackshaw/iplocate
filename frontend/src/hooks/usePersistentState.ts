import { SetStateAction, useEffect, useState } from "react";

export const usePersistentState = <T>(
  key: string,
  defaultValue: any = undefined
): [T, React.Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    const existing = localStorage.getItem(key);
    if (existing) {
      return JSON.parse(existing);
    }
    return defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};
