import {useEffect, useRef} from 'react';

type CallbackRef = React.MutableRefObject<any> & {current: Function};

export function useInterval(callback: Function, delay: number) {
  const savedCallback: CallbackRef = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => savedCallback.current();
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
