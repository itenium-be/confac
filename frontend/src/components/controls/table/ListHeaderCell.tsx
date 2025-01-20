import { useState } from "react";
import useHover from "../../hooks/useHover";
import { t } from "../../utils";
import { SortIcon } from "../Icon";

type ListHeaderCellProps = {
  width: string | undefined | number
  header:string
  addSort: boolean,
  onSort?: (asc: boolean) => void
}

export const ListHeaderCell = ({width, header, addSort, onSort}: ListHeaderCellProps) => {
  const [hovered, eventHandlers] = useHover();
  const [asc, setAsc] = useState<boolean | undefined>(undefined)

  return (

    <th style={{width}} {...eventHandlers}>
      {header ? t(header) : <>&nbsp;</>}
      {addSort && hovered ? <><SortIcon fa={asc ? "fa fa-arrow-up" : "fa fa-arrow-down"} onClick={() => {setAsc(!asc); if(onSort) onSort(!asc);}} size={1}/></> : <>&nbsp;</>}
    </th>
  )
}
