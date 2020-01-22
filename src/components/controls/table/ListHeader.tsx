import React from 'react';
import {t} from '../../utils';
import {IListCell} from './table-models';


type ListHeaderProps = {
  columns: IListCell[];
}

export const ListHeader = ({columns}: ListHeaderProps) => (
  <thead>
    <tr>
      {columns.map(col => {
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
