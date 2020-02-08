import React, {useState, useEffect} from 'react';


export default function useDebounce<T>(value: T, delay = 500) {
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
    [value],
  );

  return debouncedValue;
}


export function useDebounce2<T>(value: T, callback: (m: T) => void, delay: number = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      const handler = setTimeout(() => {
        // setDebouncedValue(value);
        callback(debouncedValue);
      }, delay);

      // setDebouncedValue(value);

      return () => {
        clearTimeout(handler);
      };
    },
    [value],
  );

  return debouncedValue;
}


// const dispatch = useDispatch();
// const [timesheet, setTimesheet] = useState<ProjectMonthTimesheet>(projectMonth.details.timesheet || getNewProjectMonthTimesheet());

// // TODO: Oh my.. add a debounce hook(duplicated in the other cells?)
// const realSetTimesheet = (patch: {[key in keyof ProjectMonthTimesheet]?: any}): ProjectMonthTimesheet => {
//   const newTimesheet = {...timesheet, ...patch};
//   setTimesheet(newTimesheet);
//   return newTimesheet;
// };

// const saveTimesheet = (newTimesheet?: ProjectMonthTimesheet) => {
//   dispatch(patchProjectsMonth({...projectMonth.details, timesheet: newTimesheet || timesheet}));
// };
