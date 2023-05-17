/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import {IList, IListCell, ProjectMonthListFilters} from '../../controls/table/table-models';
import {Features, IFeature, IFeatureBuilderConfig} from '../../controls/feature/feature-models';
import {features} from '../../../trans';
import {FullProjectMonthModel} from './FullProjectMonthModel';
import {t, searchinize} from '../../utils';
import {ProjectMonthTimesheetCell} from '../project-month-list/table/ProjectMonthTimesheetCell';
import {ProjectMonthConsultantCell} from '../project-month-list/table/ProjectMonthConsultantCell';
import {ProjectMonthInboundCell} from '../project-month-list/table/inbound/ProjectMonthInboundCell';
import {ProjectMonthOutboundCell} from '../project-month-list/table/outbound/ProjectMonthOutboundCell';
import {getInvoiceDueDateVariant} from '../../invoice/invoice-table/getInvoiceListRowClass';
import {ProjectMonthNotesCell} from '../project-month-list/table/ProjectMonthNotesCell';
import {ConsultantCountFooter} from '../project-month-list/table/footers/ConsultantCountFooter';
import { ProjectClientForecastFooter } from "../project-month-list/table/footers/ProjectClientForecastFooter";
import {ProjectForecastPartnerFooter} from "../project-month-list/table/footers/ProjectForecastPartnerFooter";
import {Switch} from '../../controls/form-controls/Switch';


export type ProjectMonthFeatureBuilderConfig = IFeatureBuilderConfig<FullProjectMonthModel, ProjectMonthListFilters>;



const fullProjectSearch = (filters: ProjectMonthListFilters, prj: FullProjectMonthModel) => {
  if (filters.unverifiedOnly) {
    if (prj.details.verified)
      return false;

    if (prj.invoice?.verified && (!prj.project.projectMonthConfig.inboundInvoice || prj.details.inbound.status === 'paid'))
      return false;
  }

  if (!filters.freeText) {
    return true;
  }

  const {details, consultant, client, partner} = prj;

  const freeText = searchinize(filters.freeText);
  if (searchinize(prj.invoice?.number?.toString() || '') === freeText) {
    return true;
  }

  if (searchinize(prj.project.client.ref || '').includes(freeText)) {
    return true;
  }

  if (searchinize(prj.project.partner?.ref || '').includes(freeText)) {
    return true;
  }

  if (searchinize(prj.details.orderNr).includes(freeText)) {
    return true;
  }

  return searchinize(
    `${details.month.format('MMMM YYYY')}
    ${consultant.firstName} ${consultant.name} ${consultant.firstName}
    ${client.name} ${partner?.name}`,
  ).includes(freeText);
};





const projectListConfig = (config: ProjectMonthFeatureBuilderConfig): IList<FullProjectMonthModel, ProjectMonthListFilters> => {
  const list: IListCell<FullProjectMonthModel>[] = [{
    key: 'project',
    value: p => <ProjectMonthConsultantCell fullProjectMonth={p} />,
    className: p => {
      if (p.details.verified || p.invoice?.verified) {
        return 'validated';
      }
      return undefined;
    },
    footer: models => {
      const consultants = models.map(x => x.consultant);
      if (!consultants.length) {
        return null;
      }
      return <ConsultantCountFooter consultants={consultants} month={models[0].details.month} />;
    },
  }, {
    key: 'timesheet',
    value: p => <ProjectMonthTimesheetCell fullProjectMonth={p} />,
    className: p => {
      if (p.details.timesheet.validated || p.details.verified === 'forced') {
        return 'validated';
      }
      return undefined;
    },
  }, {
    key: 'inbound',
    value: p => <ProjectMonthInboundCell fullProjectMonth={p} />,
    className: p => {
      if (!p.project.projectMonthConfig.inboundInvoice || p.details.inbound.status === 'paid' || p.details.verified === 'forced') {
        return 'validated';
      }

      switch (p.details.inbound.status) {
        case 'validated':
          return 'table-warning';
        case 'new':
        default:
          return undefined;
      }
    },
    footer: (models: FullProjectMonthModel[]) => {
      if (!models.length) {
        return null;
      }
      return <ProjectForecastPartnerFooter models={models} month={models[0].details.month} />;
    },
  }, {
    key: 'outbound',
    value: p => <ProjectMonthOutboundCell fullProjectMonth={p} />,
    className: p => {
      if (p.invoice) {
        if (p.invoice.verified) {
          return 'validated';
        }
        return `table-${getInvoiceDueDateVariant(p.invoice)}`;
      }
      return undefined;
    },
    footer: (models: FullProjectMonthModel[]) => {
      if (!models.length) {
        return null;
      }
      return <ProjectClientForecastFooter models={models} month={models[0].details.month} />;
    },
  }, {
    key: 'notes',
    value: p => <ProjectMonthNotesCell fullProjectMonth={p} />,
    className: p => {
      if (p.details.verified || p.invoice?.verified) {
        return 'validated';
      }
      return undefined;
    },
  }];

  return {
    rows: {
      cells: list,
    },
    listTitle: () => t('project.projectMonthConfig.titleConfig'),
    data: config.data,
    sorter: (a, b) => `${a.client.name} ${a.consultant.firstName} ${a.consultant.name} ${a._id}`
      .localeCompare(`${b.client.name} ${b.consultant.firstName} ${b.consultant.name} ${b._id}`),
  };
};


export const projectMonthFeature = (config: ProjectMonthFeatureBuilderConfig): IFeature<FullProjectMonthModel, ProjectMonthListFilters> => {
  const feature: IFeature<FullProjectMonthModel, ProjectMonthListFilters> = {
    key: Features.projectMonths,
    nav: m => `/projects/${m === 'create' ? m : m.details.month.format('YYYY/MM')}`,
    trans: features.projectMonth as any,
    list: projectListConfig(config),
  };

  feature.list.filter = {
    state: config.filters,
    updateFilter: config.setFilters,
    fullTextSearch: fullProjectSearch,
    softDelete: false,
    extras: () => (
      <Switch
        value={config.filters.unverifiedOnly}
        onChange={value => config.setFilters({...config.filters, unverifiedOnly: value})}
        label={t('projectMonth.filterUnverified')}
      />
    ),
  };

  return feature;
};
