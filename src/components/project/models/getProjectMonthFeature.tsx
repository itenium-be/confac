/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import {IList, IListCell, ProjectMonthListFilters} from '../../controls/table/table-models';
import {IFeature, IFeatureBuilderConfig} from '../../controls/feature/feature-models';
import {features} from '../../../trans';
import {FullProjectMonthModel} from './ProjectMonthModel';
import {t} from '../../utils';
import {ProjectMonthTimesheetCell} from '../project-month-list/ProjectMonthTimesheetCell';
import {ProjectMonthConsultantCell} from '../project-month-list/ProjectMonthConsultantCell';
import {ProjectMonthInboundCell} from '../project-month-list/ProjectMonthInboundCell';
import {ProjectMonthOutboundCell} from '../project-month-list/ProjectMonthOutboundCell';


export type ProjectMonthFeatureBuilderConfig = IFeatureBuilderConfig<FullProjectMonthModel, ProjectMonthListFilters>;



const fullProjectSearch = (filters: ProjectMonthListFilters, prj: FullProjectMonthModel) => {
  // if (!filters.showInactive && !details.active) {
  //   return false;
  // }

  if (!filters.freeText) {
    return true;
  }

  // return searchinize(
  //   `${consultant.name} ${consultant.firstName}`,
  // ).includes(filters.freeText.toLowerCase());
  return true;
};



const getRowBackgroundColor = (prj: FullProjectMonthModel): undefined | string => {
  // return 'table-danger';
  // return 'table-warning';
  // return 'table-info';
  return undefined;
};



const projectListConfig = (config: ProjectMonthFeatureBuilderConfig): IList<FullProjectMonthModel, ProjectMonthListFilters> => {
  const list: IListCell<FullProjectMonthModel>[] = [{
    key: 'consultant',
    value: p => <ProjectMonthConsultantCell projectMonth={p} />,
  }, {
    key: 'timesheet',
    value: p => <ProjectMonthTimesheetCell projectMonth={p} />,
  }, {
    key: 'inbound',
    value: p => <ProjectMonthInboundCell projectMonth={p} />,
  }, {
    key: 'outbound',
    value: p => <ProjectMonthOutboundCell projectMonth={p} />,
  }];

  return {
    rows: {
      className: getRowBackgroundColor,
      cells: list,
    },
    listTitle: () => {
      if (!config.data.length) {
        return t('projectMonth.title');
      }
      const model = config.data[0];
      let month = model.details.month.format('MMMM');
      month = month.charAt(0).toUpperCase() + month.slice(1);
      return t('projectMonth.listTitle', {month, year: model.details.month.year()});
    },
    data: config.data,
    sorter: (a, b) => a.details._id.localeCompare(b.details._id),
  };
};


export const projectMonthFeature = (config: ProjectMonthFeatureBuilderConfig): IFeature<FullProjectMonthModel, ProjectMonthListFilters> => {
  const feature: IFeature<FullProjectMonthModel, ProjectMonthListFilters> = {
    key: 'projectMonths',
    nav: m => `/projects/${m === 'create' ? m : m.details.month.format('YYYY/MM')}`,
    trans: features.projectMonth as any,
    list: projectListConfig(config),
  };

  feature.list.filter = {
    state: config.filters,
    updateFilter: config.setFilters,
    fullTextSearch: fullProjectSearch,
    softDelete: false,
  };

  return feature;
};
