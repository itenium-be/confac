import useHover from "../../hooks/useHover";
import { t } from "../../utils";
import { SortIcon } from "../Icon";
import { ListFilters } from "./table-models";

type ListHeaderCellProps = {
  width: string | undefined | number
  columnName: string,
  header:string,
  filter: ListFilters
  onSort?: (asc: boolean | undefined) => void
}

export const ListHeaderCell = ({width, columnName, header, filter, onSort}: ListHeaderCellProps) => {
  const [hovered, eventHandlers] = useHover();
  //const [asc, setAsc] = useState<boolean | undefined>(undefined)
  console.log(filter);
  return (
    // <th style={{width}} {...eventHandlers}>
    //   {header ? t(header) : <>&nbsp;</>}
    //   {onSort && (hovered || asc !== undefined) ? <SortIcon
    //     fa={asc ? "fa fa-arrow-up" : "fa fa-arrow-down"}
    //     onClick={() => {
    //       let isAsc = asc;
    //       if(asc === false){
    //         isAsc = undefined;
    //       }else if (asc === undefined){
    //         isAsc = true;
    //       }else {
    //         isAsc = false;
    //       }

    //       setAsc(isAsc);
    //       onSort(isAsc);
    //     }}
    //     style={{marginLeft: "3px"}}
    //     size={1}/> : <>&nbsp;</>}
    // </th>
    <th style={{width}} {...eventHandlers}>
    {header ? t(header) : <>&nbsp;</>}
    {onSort && (hovered || (filter.sort?.direction !== undefined && filter.sort?.columnName === columnName)) ? <SortIcon
      fa={filter.sort?.columnName !== columnName || filter.sort?.direction === 'asc' ? "fa fa-arrow-up" : "fa fa-arrow-down"}
      onClick={() => {
          let isAsc;
          if(filter.sort?.columnName === columnName){
            if(filter.sort?.direction === 'desc'){
              isAsc = undefined;
            }else if (filter.sort?.direction === undefined){
              isAsc = true;
            }else {
              isAsc = false;
            }
          }else{
            isAsc = true
          }


          onSort(isAsc);
        }}
      style={{marginLeft: "3px"}}
      size={1}/> : <>&nbsp;</>}
  </th>
  )
}
