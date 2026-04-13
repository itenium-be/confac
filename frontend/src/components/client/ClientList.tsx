import {useSelector} from 'react-redux';
import {saveClient, updateAppFilters} from '../../actions/index';
import {ConfacState} from '../../reducers/app-state';
import {clientFeature, ClientFeatureBuilderConfig} from './models/getClientFeature';
import {ListPage} from '../controls/table/ListPage';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {Features} from '../controls/feature/feature-models';
import {useAppDispatch} from '../hooks/useAppDispatch';

import './clients-list.scss';

export const ClientList = () => {
  useDocumentTitle('clientList');

  const dispatch = useAppDispatch();
  const filters = useSelector((state: ConfacState) => state.app.filters.clients);
  const data = useSelector((state: ConfacState) => state.clients);
  const invoices = useSelector((state: ConfacState) => state.invoices);

  const config: ClientFeatureBuilderConfig = {
    data,
    save: (m, stayOnPage) => dispatch(saveClient(m, stayOnPage)),
    filters,
    setFilters: f => dispatch(updateAppFilters(Features.clients, f)),
    invoices,
  };

  const feature = clientFeature(config);

  return (
    <ListPage feature={feature} />
  );
};
