import React, { CSSProperties } from 'react';
import {Table} from 'react-bootstrap';
import {ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable} from '@tanstack/react-table'
import {useVirtual} from 'react-virtual';
import {IFeature} from '../feature/feature-models';
import {IListHeaderCell} from './table-models';
import {t} from '../../utils';
import {ListFooter} from './ListFooter';

import './List.scss';



type ListProps = {
  feature: IFeature<any, any>;
}

export function List({feature}: ListProps) {
  const data = React.useMemo(() => {
    let initialData = feature.list.data;
    const filter = feature.list.filter;
    if (filter?.fullTextSearch) {
      initialData = initialData.filter(model => filter.fullTextSearch!(filter.state, model));
    }

    if (feature.list.sorter) {
      initialData = initialData.slice().sort(feature.list.sorter);
    }

    return initialData;
  }, [feature.list.data, feature.list.filter, feature.list.sorter]);


  const [sorting, setSorting] = React.useState<SortingState>([]);

  // TODO: export interface IListCell<TModel> {
  //   style?: React.CSSProperties;
  //   className?: string | StringFn<TModel>;

  /** Do not set header width when using this value */
  const UnsetWidth = 20;
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => feature.list.rows.cells.map(rowConfig => ({
      id: rowConfig.key,
      accessorFn: val => val,
      header: mapHeader(rowConfig.header),
      size: typeof rowConfig.header === 'object' && typeof rowConfig.header.width === 'number' ? rowConfig.header.width : UnsetWidth,
      cell: cellConfig => {
        const mdl = cellConfig.getValue();
        return rowConfig.value(mdl);
      },
    })),
    [feature.list.rows.cells]
  );



  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10,
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

  return (
    <div ref={tableContainerRef} className="virtual-table">
      <Table size="sm" className={`table-${feature.key}`}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const headerStyle: CSSProperties = {width: header.getSize()};
                if (headerStyle.width === UnsetWidth) {
                  headerStyle.width = undefined;
                }
                return (
                  <th key={header.id} colSpan={header.colSpan} style={headerStyle}>
                    <div
                      {...{
                        className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender( header.column.columnDef.header, header.getContext())}
                      {{asc: ' 🔼', desc: ' 🔽'}[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {paddingTop > 0 && (
            <tr>
              <td style={{height: paddingTop}} />
            </tr>
          )}
          {virtualRows.map(virtualRow => {
            const row = rows[virtualRow.index];
            // tr: config.rows.className && config.rows.className(model)
            // td: const className = typeof col.className === 'function' ? col.className(model) : col.className;
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  )
                })}
              </tr>
            )
          })}
          {paddingBottom > 0 && (
            <tr>
              <td style={{height: paddingBottom}} />
            </tr>
          )}
        </tbody>
        <ListFooter config={feature.list} data={data} />
      </Table>
    </div>
  )
}


function mapHeader(header?: string | IListHeaderCell | false): string {
  if (header === false || !header)
    return '';

  if (typeof header === 'string')
    return t(header);

  return t(header.title);
}


// import React from 'react';
// import {Table} from 'react-bootstrap';
// import {ListHeader} from './ListHeader';
// import {ListRow} from './ListRow';
// import {ListFooter} from './ListFooter';
// import {IFeature} from '../feature/feature-models';
// import {IList} from './table-models';

// export const List = ({feature}: ListProps) => {
//   const config = feature.list;
//   let {data} = config;
//   if (feature.list.filter) {
//     const {filter} = feature.list;
//     if (filter.fullTextSearch) {
//       const {fullTextSearch} = filter;
//       data = data.filter(model => fullTextSearch(filter.state, model));
//     }
//   }

//   if (feature.list.sorter) {
//     data = data.slice().sort(feature.list.sorter);
//   }
//   return (
//     <Table size="sm" className={`table-${feature.key}`}>
//       <ListHeader feature={feature} />
//       <tbody>
//         {data.map(model => (
//           <ListRow config={config} model={model} key={model._id} />
//         ))}
//       </tbody>
//       <ListFooter config={config} data={data} />
//     </Table>
//   );
// };

