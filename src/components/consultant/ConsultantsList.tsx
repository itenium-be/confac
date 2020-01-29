import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {ConfacState} from '../../reducers/app-state';
import {ListPage} from '../controls/table/ListPage';
import {consultantFeature, ConsultantFeatureBuilderConfig} from './models/getConsultantFeature';
import {ConsultantModel} from './models/ConsultantModel';
import {searchinize} from '../utils';
import {saveConsultant} from '../../actions/consultantActions';
import {ConsultantListFilters} from '../controls/table/table-models';


const getConsultantListFilters = (): ConsultantListFilters => {
  return {
    freeText: '',
    showInactive: false,
  };
};


const searchConsultantFor = (filters: ConsultantListFilters, model: ConsultantModel): boolean => {
  if (!filters.showInactive && !model.active) {
    return false;
  }

  if (!filters.freeText) {
    return true;
  }

  return searchinize(
    `${model.name} ${model.firstName} ${model.type} ${model.email} ${model.telephone}`,
  ).includes(filters.freeText.toLowerCase());
};



export const ConsultantsList = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<ConsultantListFilters>(getConsultantListFilters());
  const models = useSelector((state: ConfacState) => state.consultants);
  const config: ConsultantFeatureBuilderConfig = {
    data: models,
    save: m => dispatch(saveConsultant(m)),
  };

  const feature = consultantFeature(config);


  feature.list.filter = {
    state: filters,
    updateFilter: (f: ConsultantListFilters) => setFilters(f),
    fullTextSearch: searchConsultantFor,
    softDelete: true,
  };
  return (
    <ListPage feature={feature} />
  );
};
