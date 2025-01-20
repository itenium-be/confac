import {useState} from 'react';
import {Table} from 'react-bootstrap';
import {ListHeader} from './ListHeader';
import {ListRow} from './ListRow';
import {ListFooter} from './ListFooter';
import {IFeature} from '../feature/feature-models';
import {useSelector} from 'react-redux';
import {ConfacState} from '../../../reducers/app-state';
import { Pagination } from './Pagination';


type ListProps = {
  feature: IFeature<any, any>;
}

export const List = ({feature}: ListProps) => {
  const listSize = useSelector((state: ConfacState) => state.app.settings.listSize);
  const [page, setPage] = useState(0);

  const config = feature.list;
  let {data} = config;
  if (feature.list.filter) {
    const {filter} = feature.list;
    if (filter.fullTextSearch) {
      const {fullTextSearch} = filter;
      data = data.filter(model => fullTextSearch(filter.state, model));
    }
  }

  if (feature.list.sorter) {
    data = data.slice().sort(feature.list.sorter);
  }

  const handleSort = (sort: any) => {
    data = data.slice().sort(sort);
    console.log("sorted", data.map((val) => val.consultantName));
  }

  return (
    <Table size="sm" className={`table-${feature.key}`}>
      <ListHeader feature={feature} onSort={handleSort} />
      <tbody>
        {data.slice(page * listSize, page * listSize + listSize).map(model => (
          <ListRow config={config} model={model} key={model._id} />
        ))}
      </tbody>
      <Pagination current={page} total={data.length} onChange={setPage} />
      <ListFooter config={config} data={data} />
    </Table>
  );
};
