import useHover from "../../hooks/useHover";
import { t } from "../../utils";
import { SortIcon } from "../Icon";
import { ListFilters, SortDirection, SortDirections } from "./table-models";

type ListHeaderCellProps = {
  width: string | undefined | number
  columnName: string,
  header:string,
  filter: ListFilters
  onSort?: (asc: boolean | undefined) => void
}

export const ListHeaderCell = ({width, columnName, header, filter, onSort}: ListHeaderCellProps) => {
  const [hovered, eventHandlers] = useHover();
  //showing sort icon when hovering or having a direction and dealing with the same column
  const showSortIcon = hovered || (filter?.sort?.direction !== undefined && filter?.sort?.columnName === columnName)
  return (
    <th style={{width}} {...eventHandlers}>
      {header ? t(header) : <>&nbsp;</>}
      {onSort && (
        <SortIcon
          fa={filter.sort?.columnName !== columnName || filter.sort?.direction === SortDirections.ASC ? "fa fa-arrow-up" : "fa fa-arrow-down"}
          onClick={() => {
            let isAsc: boolean | undefined;
            //only change direction is we are dealing with same column
            //otherwise always begin sorting ascending order
            if (filter.sort?.columnName === columnName) {
              isAsc = switchDirection(filter.sort?.direction);
            } else {
              isAsc = true;
            }
            onSort(isAsc);
          }}
          style={{
            marginLeft: 3,
            visibility: showSortIcon ? 'visible' : 'hidden',
            color: filter.sort && filter.sort?.columnName === columnName ? undefined : 'hsl(0, 0%, 60%)'
          }}
          size={1}
        />
      )}
    </th>
  )
}

const switchDirection = (direction: SortDirection) : boolean | undefined => {
  if (direction === SortDirections.DESC) {
    return undefined;
  } else if (direction === undefined) {
    return true;
  } else {
    return false;
  }
}
