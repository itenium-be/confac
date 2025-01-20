import { useState } from "react";
import useHover from "../../hooks/useHover";
import { t } from "../../utils";
import { SortIcon } from "../Icon";

type ListHeaderCellProps = {
  width: string | undefined | number
  header:string
  onSort?: (asc: boolean | undefined) => void
}

export const ListHeaderCell = ({width, header, onSort}: ListHeaderCellProps) => {
  const [hovered, eventHandlers] = useHover();
  const [asc, setAsc] = useState<boolean | undefined>(undefined)

  return (
    <th style={{width}} {...eventHandlers}>
      {header ? t(header) : <>&nbsp;</>}
      {asc !== undefined || (onSort && hovered) ? <SortIcon
        fa={asc ? "fa fa-arrow-up" : "fa fa-arrow-down"}
        onClick={() => {
          if(asc === false){
            setAsc(undefined)
          }else if (asc === undefined){
            setAsc(true)
          }else {
            setAsc(false)
          }

          if(onSort){
            onSort(asc);
          }
        }}
        style={{marginLeft: "3px"}}
        size={1}/> : <>&nbsp;</>}
    </th>
  )
}
