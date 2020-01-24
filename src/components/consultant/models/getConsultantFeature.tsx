/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import {Link} from 'react-router-dom';
import {ConsultantModel} from './ConsultantModel';
import {IList, IListCell} from '../../controls/table/table-models';
import {t} from '../../utils';
import {IFeature} from '../../controls/feature/feature-models';
import {features} from '../../../trans';


const consultantListConfig = (data: ConsultantModel[]): IList<ConsultantModel> => {
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
  }];

  return {
    rows: {
      cells,
    },
    data,
    sorter: (a, b) => `${a.firstName} ${a.name}`.localeCompare(`${b.firstName} ${b.name}`),
  };
};

export const consultantFeature = (data: ConsultantModel[]): IFeature<ConsultantModel> => {
  return {
    nav: m => `/consultants/${m === 'create' ? m : m.slug}`,
    trans: features.consultant,
    list: consultantListConfig(data),
  };
};
