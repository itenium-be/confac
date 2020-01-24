import React from 'react';
import {t} from '../../utils';
import {IFeature} from '../feature/feature-models';


type ListHeaderProps<TModel> = {
  feature: IFeature<TModel>;
}

export const ListHeader = ({feature}: ListHeaderProps<any>) => {
  return (
    <thead>
      <tr>
        {feature.list.rows.cells.map(col => {
          let header: string = '';
          let width: string | undefined;
          if (!col.header) {
            header = feature.trans.props[col.key];
          } else if (typeof col.header === 'string') {
            header = col.header;
          } else if (col.header.title) {
            header = col.header.title;
            width = col.header.width;
          }

          return (
            <th key={col.key} style={{width}}>
              {header ? t(header) : <>&nbsp;</>}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
