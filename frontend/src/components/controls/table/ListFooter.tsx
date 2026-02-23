import {IList, ListFilters} from './table-models';


type ListFooterProps<TModel, TFilterModel extends ListFilters = ListFilters> = {
  config: IList<TModel, TFilterModel>;
  /** Filtered data */
  data: TModel[];
}


export const ListFooter = <TModel, TFilterModel extends ListFilters = ListFilters>({config, data}: ListFooterProps<TModel, TFilterModel>) => {
  if (config.data.length === 0) {
    return null;
  }

  const footerCells = cellsToFooterCells(config);
  if (!footerCells.length) {
    return null;
  }

  return (
    <tfoot>
      <tr>
        {config.rows.cells.map((cell, cellIndex) => {
          const footerCell = footerCells[cellIndex];
          switch (footerCell) {
            case 'empty-cell':
              return <td>&nbsp;</td>;

            default:
            case null:
              if (!cell.footer) {
                return null;
              }

              return (
                <td key={cell.key} colSpan={footerCell || 1}>
                  {typeof cell.footer === 'string' ? cell.footer : cell.footer(data)}
                </td>
              );
          }
        })}
      </tr>
    </tfoot>
  );
};


/** Mapped cells that have a footer */
type IFooterCells = null | number | 'empty-cell';

export function cellsToFooterCells<TModel, TFilterModel extends ListFilters = ListFilters>(input: IList<TModel, TFilterModel>): IFooterCells[] {
  const {cells} = input.rows;
  if (!cells.some(c => c.footer)) {
    return [];
  }

  let firstFooterPassed = false;

  let lastFooterIndex = cells.slice().reverse().findIndex(c => !!c.footer);
  lastFooterIndex = lastFooterIndex >= 0 ? cells.length - 1 - lastFooterIndex : lastFooterIndex;


  const result: IFooterCells[] = cells.map((cell, cellIndex) => {
    if (!cell.footer) {
      if (!firstFooterPassed) {
        return 'empty-cell';
      }
      return null;
    }

    let colSpan: number;
    if (cellIndex === lastFooterIndex) {
      colSpan = cells.length - cellIndex;
    } else {
      const nextIndex = cells.filter((c, i) => i > cellIndex).findIndex(c => c.footer) + 1;
      colSpan = nextIndex;
    }

    firstFooterPassed = true;
    return colSpan;
  });
  return result;
}
