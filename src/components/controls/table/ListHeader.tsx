import React from 'react';
import {t} from '../../utils';
import {IList} from './table-models';


type ListHeaderProps<TModel> = {
  config: IList<TModel>;
}

export const ListHeader = ({config}: ListHeaderProps<any>) => (
  <thead>
    <tr>
      {config.rows.cells.map(col => {
        if (typeof col.header === 'string') {
          return <th key={col.key}>{col.header ? t(col.header) : <>&nbsp;</>}</th>;
        }

        return (
          <th key={col.key} style={{width: col.header.width}}>
            {col.header.title ? t(col.header.title) : <>&nbsp;</>}
          </th>
        );
      })}
    </tr>
  </thead>
);
