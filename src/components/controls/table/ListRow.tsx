import React from 'react';
import {IListCell, IList} from './table-models';


type ListRowProps<TModel> = {
  config: IList<TModel>,
  model: TModel,
}


export const ListRow = ({model, config}: ListRowProps<any>) => {
  return (
    <tr className={config.rows.className && config.rows.className(model)}>
      {config.rows.cells.map((col: IListCell<any>) => {
        return (
          <td key={col.key} style={col.style} className={col.className}>
            {col.value(model)}
          </td>
        );
      })}
    </tr>
  );
};
