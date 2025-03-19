import {useCallback, useState} from 'react';
import {Table} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import {ConfacState} from '../../../reducers/app-state';
import { Pagination } from './Pagination';
import { CheckboxInput } from '../form-controls/inputs/CheckboxInput';
import { formatDate, t } from '../../utils';
import moment from 'moment';
import InvoiceModel from '../../invoice/models/InvoiceModel';

import './ListSelect.scss';

export type ListSelectionItem<TModel> = TModel | TModel[]

type ListSelectProps<TModel> = {
  /** List of available items */
  data: TModel[],
  /** Currently selected items */
  value: TModel[],
  onChange: (selection: TModel[]) => void,
  listSize?: number,
}

export const ListSelect = ({data, value, onChange, ...props}: ListSelectProps<InvoiceModel>) => {
  const listSize = useSelector((state: ConfacState) => props.listSize ?? state.app.settings.listSize);
  const [page, setPage] = useState(0);

  const handleCheckboxChange = useCallback((model: ListSelectionItem<InvoiceModel>) => {
    if (Array.isArray(model)) {
      onChange([...value, ...model]);
    } else {
      onChange([...value, model]);
    }
  }, [value, onChange]);

  return (
    <Table size="sm" className="list-select">
      <thead>
        <tr>
          <th>&nbsp;</th>
          <th>{t('invoice.numberShort')}</th>
          <th>{t('invoice.client')}</th>
          <th>{t('invoice.dateShort')}</th>
          <th>{t('invoice.period')}</th>
          <th>{t('invoice.consultant')}</th>
        </tr>
      </thead>
      <tbody>
        {data.slice(page * listSize, page * listSize + listSize).map(model => (
          <tr key={model._id}>
            <td>
              <CheckboxInput
                value={Array.isArray(value) && value.map(i => i._id).includes(model._id)}
                onChange={() => handleCheckboxChange(model)}
                label=''
              />
            </td>
            <td>#{model.number}</td>
            <td>{model.client.name}</td>
            <td>{formatDate(model.date, 'DD/MM/YY')}</td>
            <td>{model.projectMonth?.month && moment(model.projectMonth.month).format('M/YY')}</td>
            <td>{model.projectMonth?.consultantName}</td>
          </tr>
        ))}
      </tbody>
      <Pagination listSize={listSize} current={page} total={data.length} onChange={setPage} />
    </Table>
  );
};
