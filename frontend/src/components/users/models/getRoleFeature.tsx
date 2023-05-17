/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import {IList, IListCell, RolesListFilters} from '../../controls/table/table-models';
import {searchinize} from '../../utils';
import {Features, IFeature, IFeatureBuilderConfig} from '../../controls/feature/feature-models';
import {features} from '../../../trans';
import {EditIcon} from '../../controls/Icon';
import {RoleModel} from './UserModel';


export type RoleFeatureBuilderConfig = IFeatureBuilderConfig<RoleModel, RolesListFilters>;


const searchRoleFor = (filters: RolesListFilters, model: RoleModel): boolean => {
  if (!filters.freeText) {
    return true;
  }

  return searchinize(
    `${model.name} ${model.claims.join(' ')}`,
  ).includes(searchinize(filters.freeText));
};



const RoleListConfig = (config: RoleFeatureBuilderConfig): IList<RoleModel, RolesListFilters> => {
  const cells: IListCell<RoleModel>[] = [{
    key: 'name',
    value: m => m.name,
  }, {
    key: 'claims',
    value: m => m.claims.join(', '),
  }, {
    key: 'buttons',
    header: {title: '', width: 110},
    value: m => (
      <>
        <EditIcon onClick={`/roles/${m.name}`} style={{marginRight: 15}} size={1} />
      </>
    ),
  }];

  return {
    rows: {
      cells,
    },
    data: config.data,
    sorter: (a, b) => a.name.localeCompare(b.name),
  };
};



export const roleFeature = (config: RoleFeatureBuilderConfig): IFeature<RoleModel, RolesListFilters> => {
  const feature: IFeature<RoleModel, RolesListFilters> = {
    key: Features.roles,
    nav: m => `/roles/${m === 'create' ? m : m.name}`,
    trans: features.roles as any,
    list: RoleListConfig(config),
  };

  feature.list.filter = {
    state: config.filters,
    updateFilter: config.setFilters,
    fullTextSearch: searchRoleFor,
    softDelete: false,
  };

  return feature;
};
