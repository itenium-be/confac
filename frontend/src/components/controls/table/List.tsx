import {useState} from 'react';
import {Table} from 'react-bootstrap';
import {ListHeader} from './ListHeader';
import {ListRow} from './ListRow';
import {ListFooter} from './ListFooter';
import {IFeature} from '../feature/feature-models';
import {useSelector} from 'react-redux';
import {ConfacState} from '../../../reducers/app-state';
import {Pagination} from './Pagination';
import {SortDirections, ListFilters} from './table-models';
import {sortResult} from '../../utils';


type ListProps<TModel, TFilterModel extends ListFilters = ListFilters> = {
  feature: IFeature<TModel, TFilterModel>;
}

export const filterAndSortFeatureData = <TModel, TFilterModel extends ListFilters = ListFilters>(feature: IFeature<TModel, TFilterModel>): TModel[] => {
  const config = feature.list;
  let {data} = config;
  if (feature.list.filter) {
    const {filter} = feature.list;
    if (filter.fullTextSearch) {
      const {fullTextSearch} = filter;
      data = data.filter(model => fullTextSearch(filter.state, model));
    }
  }

  if (feature.list.filter?.state?.sort) {
    const key = feature.list.filter?.state?.sort.columnName;
    const cell = feature.list.rows.cells.find(col => col.key === key);
    if (cell && cell.sort) {
      const asc = feature.list.filter?.state?.sort.direction === SortDirections.ASC;
      data = data.slice().sort(sortResult(cell.sort, asc));
    }
  } else if (feature.list.sorter) {
    data = data.slice().sort(feature.list.sorter);
  }

  return data;
};

export const List = <TModel, TFilterModel extends ListFilters = ListFilters>({feature}: ListProps<TModel, TFilterModel>) => {
  const listSize = useSelector((state: ConfacState) => state.app.settings.listSize);
  const [page, setPage] = useState(0);

  const config = feature.list;
  const data = filterAndSortFeatureData(feature);

  return (
    <Table size="sm" className={`table-${feature.key}`}>
      <ListHeader feature={feature} />
      <tbody>
        {data.slice(page * listSize, page * listSize + listSize).map((model, index) => (
          <ListRow config={config} model={model} key={(model as { _id?: string })._id || index} />
        ))}
      </tbody>
      <Pagination current={page} total={data.length} onChange={setPage} />
      <ListFooter config={config} data={data} />
    </Table>
  );
};
