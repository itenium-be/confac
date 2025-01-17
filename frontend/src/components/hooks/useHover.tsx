const { useState, useMemo } = React;

const useHover = () => {
  const [hovered, setHovered] = useState<boolean>();

  const eventHandlers = useMemo(() => ({
    onMouseOver() { setHovered(true); },
    onMouseOut() { setHovered(false); }
  }), []);

  return {hovered, eventHandlers};
}
