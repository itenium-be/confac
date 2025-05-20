import {useDispatch} from 'react-redux';
import {IFeature} from '../feature/feature-models';
import {ListHeaderCell} from './ListHeaderCell';
import {updateAppFilters} from '../../../actions';
import {ListFilters, SortDirections} from './table-models';


type ListHeaderProps<TModel> = {
  feature: IFeature<TModel>;
}


// eslint-disable-next-line arrow-body-style
export const ListHeader = ({feature}: ListHeaderProps<any>) => {
  const dispatch = useDispatch();
  return (
    <thead>
      <tr>
        {feature.list.rows.cells.map(col => {
          let header: string = '';
          let width: string | undefined | number;
          if (!col.header) {
            header = feature.trans.props[col.key];
          } else if (typeof col.header === 'string') {
            header = col.header;
          } else {
            header = col.header.title;
            width = col.header.width;
          }

          let handleSort: ((asc: boolean | undefined) => void) | undefined = undefined;
          const filter = feature.list.filter?.state as ListFilters;
          if (col.sort) {
            handleSort = (asc: boolean | undefined) => {
              if (filter) {
                const newFilter = {
                  ...filter,
                  sort: asc !== undefined ? {
                    direction: asc ? SortDirections.ASC : SortDirections.DESC,
                    columnName: col.key
                  } : undefined
                };

                dispatch(updateAppFilters(feature.key, newFilter));
              }
            };
          }

          return (
            <ListHeaderCell
              key={col.key}
              columnName={col.key}
              width={width}
              header={header}
              filter={filter}
              onSort={handleSort}
            />
          );
        })}
      </tr>
    </thead>
  );
};
