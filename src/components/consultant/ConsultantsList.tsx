import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {ConfacState} from '../../reducers/app-state';
import {ListPage} from '../controls/table/ListPage';
import {consultantFeature, ConsultantFeatureBuilderConfig} from './models/getConsultantFeature';
import {saveConsultant} from '../../actions/consultantActions';
import {updateAppFilters} from '../../actions';


export const ConsultantsList = () => {
  const dispatch = useDispatch();
  const models = useSelector((state: ConfacState) => ({filters: state.app.filters.consultants, consultants: state.consultants}));

  const config: ConsultantFeatureBuilderConfig = {
    data: models.consultants,
    save: m => dispatch(saveConsultant(m)),
    filters: models.filters,
    setFilters: f => dispatch(updateAppFilters('consultants', f)),
  };

  const feature = consultantFeature(config);

  return (
    <ListPage feature={feature} />
  );
};
