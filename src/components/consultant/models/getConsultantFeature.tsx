/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import {ConsultantModel} from './ConsultantModel';
import {IList, IListCell, ConsultantListFilters} from '../../controls/table/table-models';
import {t, searchinize} from '../../utils';
import {IFeature, IFeatureBuilderConfig} from '../../controls/feature/feature-models';
import {features} from '../../../trans';
import {EditIcon} from '../../controls/Icon';
import {DeleteIcon} from '../../controls/icons/DeleteIcon';
import {ConsultantLinkWithModal} from '../controls/ConsultantLink';


export type ConsultantFeatureBuilderConfig = IFeatureBuilderConfig<ConsultantModel, ConsultantListFilters>;


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



function getRowClassName(m: ConsultantModel): string | undefined {
  if (!m.active) {
    return 'table-danger';
  }
  return undefined;
}


const consultantListConfig = (config: ConsultantFeatureBuilderConfig): IList<ConsultantModel, ConsultantListFilters> => {
  const cells: IListCell<ConsultantModel>[] = [{
    key: 'name',
    value: m => <ConsultantLinkWithModal consultant={m} />,
  }, {
    key: 'type',
    value: m => t(`consultant.types.${m.type}`),
  }, {
    key: 'email',
    value: m => m.email,
  }, {
    key: 'telephone',
    value: m => m.telephone,
  }, {
    key: 'buttons',
    header: {title: '', width: 110},
    value: m => (
      <>
        <EditIcon onClick={`/consultants/${m.slug}`} style={{marginRight: 15}} size={1} />
        <DeleteIcon
          onClick={() => config.save({...m, active: !m.active})}
          title={m.active ? t('feature.deactivateTitle') : t('feature.activateTitle')}
          size={1}
        />
      </>
    ),
  }];

  return {
    rows: {
      className: getRowClassName,
      cells,
    },
    data: config.data,
    sorter: (a, b) => `${a.firstName} ${a.name}`.localeCompare(`${b.firstName} ${b.name}`),
  };
};



export const consultantFeature = (config: ConsultantFeatureBuilderConfig): IFeature<ConsultantModel, ConsultantListFilters> => {
  const feature: IFeature<ConsultantModel, ConsultantListFilters> = {
    key: 'consultants',
    nav: m => `/consultants/${m === 'create' ? m : m.slug}`,
    trans: features.consultant as any,
    list: consultantListConfig(config),
  };

  feature.list.filter = {
    state: config.filters,
    updateFilter: config.setFilters,
    fullTextSearch: searchConsultantFor,
    softDelete: true,
  };

  return feature;
};
