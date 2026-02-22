import {useEffect, useRef} from 'react';

type CallbackRef = React.MutableRefObject<any> & {current: () => void};

export function useInterval(callback: () => void, delay: number) {
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
