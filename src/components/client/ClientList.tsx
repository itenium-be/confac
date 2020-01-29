import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {saveClient, updateAppFilters} from '../../actions/index';
import {ConfacState} from '../../reducers/app-state';
import {clientFeature, ClientFeatureBuilderConfig} from './models/getClientFeature';
import {ListPage} from '../controls/table/ListPage';

export const ClientList = () => {
  const dispatch = useDispatch();
  const models = useSelector((state: ConfacState) => ({
    filters: state.app.filters.clients,
    data: state.clients,
    invoices: state.invoices,
  }));

  const config: ClientFeatureBuilderConfig = {
    data: models.data,
    save: (m, stayOnPage) => dispatch(saveClient(m, stayOnPage)),
    filters: models.filters,
    setFilters: f => dispatch(updateAppFilters('clients', f)),
    invoices: models.invoices,
  };

  const feature = clientFeature(config);

  return (
    <ListPage feature={feature} />
  );
};
