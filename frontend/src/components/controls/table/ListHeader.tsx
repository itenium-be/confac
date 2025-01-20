import {IFeature} from '../feature/feature-models';
import { ListHeaderCell } from './ListHeaderCell';


type ListHeaderProps<TModel> = {
  feature: IFeature<TModel>;
  onSort?: (sort?: (a: TModel, b: TModel) => number) => void
}


// eslint-disable-next-line arrow-body-style
export const ListHeader = ({feature, onSort}: ListHeaderProps<any>) => {
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
            <ListHeaderCell key={col.key} width={width} header={header} addSort={addSort} onSort={(asc) => { if(onSort && col.sort) onSort(col.sort(asc)) }}/>
          );
        })}
      </tr>
    </thead>
  );
};
