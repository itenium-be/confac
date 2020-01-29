/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import {Link} from 'react-router-dom';
import {ConsultantModel} from './ConsultantModel';
import {IList, IListCell, ListFilters, ConsultantListFilters} from '../../controls/table/table-models';
import {t} from '../../utils';
import {IFeature} from '../../controls/feature/feature-models';
import {features} from '../../../trans';
import {DeleteIcon} from '../../controls/Icon';


export type ConsultantFeatureBuilderConfig = {
  data: ConsultantModel[];
  save: (model: ConsultantModel) => void;
}





function getRowClassName(m: ConsultantModel): string | undefined {
  if (!m.active) {
    return 'table-danger';
  }
  return undefined;
}


const consultantListConfig = (config: ConsultantFeatureBuilderConfig): IList<ConsultantModel, ConsultantListFilters> => {
  const cells: IListCell<ConsultantModel>[] = [{
    key: 'name',
    value: m => <Link to={`consultants/${m.slug}`}>{m.firstName} {m.name}</Link>,
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
    header: '',
    value: m => (
      <>
        <DeleteIcon
          onClick={() => config.save(m)}
          title={m.active ? t('feature.deactivateTitle') : t('feature.activateTitle')}
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
  return {
    key: 'consultants',
    nav: m => `/consultants/${m === 'create' ? m : m.slug}`,
    trans: features.consultant as any,
    list: consultantListConfig(config),
  };
};
