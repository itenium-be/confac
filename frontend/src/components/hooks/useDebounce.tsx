import {useState, useEffect} from 'react';


export default function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay],
  );

  return debouncedValue;
}


type ActionFn<T> = (m: T) => void;

export function useDebouncedSave<T>(defaultValue: T, callback: ActionFn<T>, delay = 500): [T, ActionFn<T>, ActionFn<T>] {
  const [value, setInternalValue] = useState<T>(defaultValue);
  const [editMode, setEditMode] = useState<boolean>(false);
  const debounced = useDebounce<T>(value, delay);
  useEffect(
    () => {
      if (editMode) {
        // Simple check: do not save if there are no changes
        if (JSON.stringify(value) !== JSON.stringify(defaultValue)) {
          // console.log('saving: ', value, defaultValue);
          callback(value);
        }

        setEditMode(false);
      }
    },
    // TODO: https://stackoverflow.com/questions/58866796/react-hooks-exhaustive-deps-lint-rule
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debounced],
  );

  const setValue = (newValue: T): void => {
    setEditMode(true);
    setInternalValue(newValue);
  };

  const saveValue = (newValue: T): void => {
    callback(newValue);
    setEditMode(false);
    setInternalValue(newValue);
  };

  return [
    value,
    setValue,
    saveValue,
  ];
}
