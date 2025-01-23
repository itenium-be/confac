import { useDispatch } from 'react-redux';
import { IFeature} from '../feature/feature-models';
import { ListHeaderCell } from './ListHeaderCell';
import { updateAppFilters } from '../../../actions';
import { ListFilters } from './table-models';


type ListHeaderProps<TModel> = {
  feature: IFeature<TModel>;
  onSort?: (sort?: (a: TModel, b: TModel) => number) => void
}


// eslint-disable-next-line arrow-body-style
export const ListHeader = ({feature, onSort}: ListHeaderProps<any>) => {
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

          let handleSort : ((asc: boolean | undefined) => void) | undefined = undefined;
          if(col.sort){
            handleSort = (asc: boolean | undefined) => {
              if(feature.list.filter?.state){
                const f = feature.list.filter?.state as ListFilters;
                if(asc !== undefined){
                  f.sort = {
                    direction: asc? "asc" : "desc",
                    columnName: col.key
                  }
                }else{
                  f.sort = undefined
                }

                dispatch(updateAppFilters(feature.key, f))
              }

            }
          }


          return (
            <ListHeaderCell
              key={col.key}
              width={width}
              header={header}
              onSort={handleSort}/>
          );
        })}
      </tr>
    </thead>
  );
};
