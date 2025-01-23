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
      {onSort && (hovered || asc !== undefined) ? <SortIcon
        fa={asc ? "fa fa-arrow-up" : "fa fa-arrow-down"}
        onClick={() => {
          let isAsc = asc;
          if(asc === false){
            isAsc = undefined;
          }else if (asc === undefined){
            isAsc = true;
          }else {
            isAsc = false;
          }

          setAsc(isAsc);
          onSort(isAsc);
        }}
        style={{marginLeft: "3px"}}
        size={1}/> : <>&nbsp;</>}
    </th>
  )
}
