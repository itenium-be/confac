import {useCallback, useState} from 'react';
import {Table} from 'react-bootstrap';
import {ListHeader} from './ListHeader';
import {ListRow} from './ListRow';
import {ListFooter} from './ListFooter';
import {IFeature} from '../feature/feature-models';
import {useSelector} from 'react-redux';
import {ConfacState} from '../../../reducers/app-state';
import { Pagination } from './Pagination';
import { SortDirections } from './table-models';
import { sortResult } from '../../utils';
import { CheckboxInput } from '../form-controls/inputs/CheckboxInput';

export type ListSelectionItem<TModel> = TModel | TModel[]

type ListSelectProps<TModel> = {
  feature: IFeature<TModel, any>;
  value?: ListSelectionItem<TModel>,
  onChange: (selection: ListSelectionItem<TModel>) => void,
  isClearable?: boolean,
  isMulti?: boolean,
  listSize?: number,
}

export const ListSelect = ({feature, value, isMulti, onChange, ...props}: ListSelectProps<any>) => {
  const listSize = useSelector((state: ConfacState) => props.listSize ?? state.app.settings.listSize);
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

  if(feature.list.filter?.state?.sort) {
    const key = feature.list.filter?.state?.sort.columnName;
    const cell = feature.list.rows.cells.find(col => col.key === key)
    if(cell && cell.sort){
      const asc = feature.list.filter?.state?.sort.direction === SortDirections.ASC;
      data = data.slice().sort(sortResult(cell.sort, asc));
    }
  }
  else if (feature.list.sorter) {
    data = data.slice().sort(feature.list.sorter);
  }

  const handleCheckboxChange = useCallback((model: any) => {
    if (isMulti) {
        if (Array.isArray(value) && value.map(i => i._id).includes(model._id)) {
            onChange(value.filter(item => item !== model));
        } else {
            onChange([...(Array.isArray(value) ? value : []), model]);
        }
    } else {
        onChange(model);
    }
}, [value, onChange, isMulti]);


  if(config.rows.cells.length > 0 && config.rows.cells[0].key !== 'select')
  {
    config.rows.cells.unshift({
    key: 'select',
    header: '',
    className: 'lst-select-check',
      value: (m) => (
        <CheckboxInput
          value={Array.isArray(value) && value.includes(m)}
          onChange={() =>handleCheckboxChange(m)} label='' />)
    })
  }


  return (
    <Table size="sm" className={`table-${feature.key}`}>
      <ListHeader feature={feature} />
      <tbody>
        {data.slice(page * listSize, page * listSize + listSize).map(model => (
          <ListRow config={config} model={model} key={model._id} />
        ))}
      </tbody>
      <Pagination listSize={listSize} current={page} total={data.length} onChange={setPage} />
      <ListFooter config={config} data={data} />
    </Table>
  );
};
