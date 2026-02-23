import {useDispatch, useSelector} from 'react-redux';
import {saveClient, updateAppFilters} from '../../actions/index';
import {ConfacState} from '../../reducers/app-state';
import {clientFeature, ClientFeatureBuilderConfig} from './models/getClientFeature';
import {ListPage} from '../controls/table/ListPage';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {Features} from '../controls/feature/feature-models';

import './clients-list.scss';

export const ClientList = () => {
  useDocumentTitle('clientList');

  const dispatch = useDispatch();
  const models = useSelector((state: ConfacState) => ({
    filters: state.app.filters.clients,
    data: state.clients,
    invoices: state.invoices,
  }));

  const config: ClientFeatureBuilderConfig = {
    data: models.data,
    save: (m, stayOnPage) => dispatch(saveClient(m, stayOnPage) as any),
    filters: models.filters,
    setFilters: f => dispatch(updateAppFilters(Features.clients, f)),
    invoices: models.invoices,
  };

  const feature = clientFeature(config);

  return (
    <ListPage feature={feature} />
  );
};
