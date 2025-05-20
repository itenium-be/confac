import {useState, useMemo} from 'react';

const useHover = (): [boolean, {onMouseOver(): void; onMouseOut(): void}] => {
  const [hovered, setHovered] = useState< boolean>(false);

  const eventHandlers = useMemo(() => ({
    onMouseOver() { setHovered(true); },
    onMouseOut() { setHovered(false); }
  }), []);

  return [hovered, eventHandlers];
};

export default useHover;
