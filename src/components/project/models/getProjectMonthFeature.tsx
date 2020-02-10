/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import {IList, IListCell, ProjectMonthListFilters} from '../../controls/table/table-models';
import {IFeature, IFeatureBuilderConfig} from '../../controls/feature/feature-models';
import {features} from '../../../trans';
import {FullProjectMonthModel} from './ProjectMonthModel';
import {t, searchinize} from '../../utils';
import {ProjectMonthTimesheetCell} from '../project-month-list/ProjectMonthTimesheetCell';
import {ProjectMonthConsultantCell} from '../project-month-list/ProjectMonthConsultantCell';
import {ProjectMonthInboundCell} from '../project-month-list/ProjectMonthInboundCell';
import {ProjectMonthOutboundCell} from '../project-month-list/ProjectMonthOutboundCell';
import {getInvoiceDueDateVariant} from '../../invoice/invoice-table/getInvoiceListRowClass';
import {ProjectMonthNotesCell} from '../project-month-list/ProjectMonthNotesCell';


export type ProjectMonthFeatureBuilderConfig = IFeatureBuilderConfig<FullProjectMonthModel, ProjectMonthListFilters>;



const fullProjectSearch = (filters: ProjectMonthListFilters, prj: FullProjectMonthModel) => {
  if (!filters.freeText) {
    return true;
  }

  const {details, consultant, client, partner} = prj;

  return searchinize(
    `${details.month.format('MMMM YYYY')} ${consultant.firstName} ${consultant.name} ${client.name} ${partner && partner.name}`,
  ).includes(filters.freeText.toLowerCase());
};



const getRowBackgroundColor = (prj: FullProjectMonthModel): undefined | string => {
  return undefined;
};



const projectListConfig = (config: ProjectMonthFeatureBuilderConfig): IList<FullProjectMonthModel, ProjectMonthListFilters> => {
  const list: IListCell<FullProjectMonthModel>[] = [{
    key: 'consultant',
    value: p => <ProjectMonthConsultantCell projectMonth={p} />,
    className: p => {
      if (p.details.verified) {
        return 'validated';
      }
      return undefined;
    },
  }, {
    key: 'timesheet',
    value: p => <ProjectMonthTimesheetCell projectMonth={p} />,
    className: p => {
      if (p.details.timesheet.validated || p.details.verified) {
        return 'validated';
      }
      return undefined;
    },
  }, {
    key: 'inbound',
    value: p => <ProjectMonthInboundCell projectMonth={p} />,
    className: p => {
      if (!p.project.projectMonthConfig.inboundInvoice || p.details.verified) {
        return 'validated';
      }

      switch (p.details.inbound.status) {
        case 'paid':
          return 'validated';
        case 'validated':
          return undefined;
        case 'new':
        default:
          return undefined;
      }
    },
  }, {
    key: 'outbound',
    value: p => <ProjectMonthOutboundCell projectMonth={p} />,
    className: p => {
      if (p.invoice) {
        if (p.invoice.verified) {
          return 'validated';
        }
        return `table-${getInvoiceDueDateVariant(p.invoice)}`;
      }
      return undefined;
    },
  }, {
    key: 'notes',
    value: p => <ProjectMonthNotesCell projectMonth={p} />,
    className: p => {
      if (p.details.verified) {
        return 'validated';
      }
      return undefined;
    },
  }];

  return {
    rows: {
      className: getRowBackgroundColor,
      cells: list,
    },
    listTitle: () => {
      return t('project.projectMonthConfig.titleConfig');
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
