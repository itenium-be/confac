export const ListHeaderCell = () => {
  const [hovered, eventHandlers] = useHover();

  return (
    <th key={col.key} style={{width}} {...eventHandlers}>
      {header ? t(header) : <>&nbsp;</>}
      {addSort ? <><SortIcon/></> : <>&nbsp;</>}
    </th>
  )
}
