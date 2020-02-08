import React from 'react';
import {IListCell, IList} from './table-models';


type ListRowProps<TModel> = {
  config: IList<TModel>,
  model: TModel,
}


export const ListRow = ({model, config}: ListRowProps<any>) => {
  // console.log('START LIST_ROW', config.rows.cells.map(c => c.key));
  return (
    <tr className={config.rows.className && config.rows.className(model)}>
      {config.rows.cells.map((col: IListCell<any>) => {
        // console.log('td', col);
        const className = typeof col.className === 'function' ? col.className(model) : col.className;
        return (
          <td key={col.key} style={col.style} className={className}>
            {col.value(model)}
          </td>
        );
      })}
    </tr>
  );
};
