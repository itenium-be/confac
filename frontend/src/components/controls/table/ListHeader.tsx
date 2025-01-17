import {t} from '../../utils';
import {IFeature} from '../feature/feature-models';
import { SortIcon } from '../Icon';


type ListHeaderProps<TModel> = {
  feature: IFeature<TModel>;
}


// eslint-disable-next-line arrow-body-style
export const ListHeader = ({feature}: ListHeaderProps<any>) => {
  return (
    <thead>
      <tr>
        {feature.list.rows.cells.map(col => {
          let header: string = '';
          let width: string | undefined | number;
          let addSort: boolean = false;
          if (!col.header) {
            header = feature.trans.props[col.key];
          } else if (typeof col.header === 'string') {
            header = col.header;
          } else {
            header = col.header.title;
            width = col.header.width;
          }

          if(col.sort) {
            addSort = true;
          }

          return (
            <th key={col.key} style={{width}}>
              {header ? t(header) : <>&nbsp;</>}
              {addSort ? <><SortIcon/></> : <>&nbsp;</>}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
