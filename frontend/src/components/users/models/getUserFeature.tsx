/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import {IList, IListCell, UsersListFilters} from '../../controls/table/table-models';
import {t, searchinize} from '../../utils';
import {Features, IFeature, IFeatureBuilderConfig} from '../../controls/feature/feature-models';
import {features} from '../../../trans';
import {EditIcon} from '../../controls/Icon';
import {DeleteIcon} from '../../controls/icons/DeleteIcon';
import {UserModel, Claim} from './UserModel';


export type UserFeatureBuilderConfig = IFeatureBuilderConfig<UserModel, UsersListFilters>;


const searchUserFor = (filters: UsersListFilters, model: UserModel): boolean => {
  if (!filters.showInactive && !model.active) {
    return false;
  }

  if (!filters.freeText) {
    return true;
  }

  return searchinize(
    `${model.name} ${model.firstName} ${model.name} ${model.alias} ${model.email}`,
  ).includes(searchinize(filters.freeText));
};



function getRowClassName(m: UserModel): string | undefined {
  if (!m.active) {
    return 'table-danger';
  }
  return undefined;
}


const userListConfig = (config: UserFeatureBuilderConfig): IList<UserModel, UsersListFilters> => {
  const cells: IListCell<UserModel>[] = [{
    key: 'name',
    value: m => `${m.firstName} ${m.name}`,
  }, {
    key: 'alias',
    value: m => m.alias,
  }, {
    key: 'email',
    value: m => {
      if (m.email) {
        return <a href={`mailto:${m.email}`}>{m.email}</a>;
      }
      return '';
    },
  }, {
    key: 'roles',
    value: m => m.roles.join(', '),
  }, {
    key: 'buttons',
    header: {title: '', width: 110},
    value: m => (
      <>
        <EditIcon onClick={`/users/${m.alias}`} style={{marginRight: 15}} size={1} />
        <DeleteIcon
          claim={Claim.ManageUsers}
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



export const userFeature = (config: UserFeatureBuilderConfig): IFeature<UserModel, UsersListFilters> => {
  const feature: IFeature<UserModel, UsersListFilters> = {
    key: Features.users,
    nav: m => `/users/${m === 'create' ? m : m.alias}`,
    trans: features.users as any,
    list: userListConfig(config),
  };

  feature.list.filter = {
    state: config.filters,
    updateFilter: config.setFilters,
    fullTextSearch: searchUserFor,
    softDelete: true,
  };

  return feature;
};
