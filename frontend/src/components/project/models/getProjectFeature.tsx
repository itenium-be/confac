/* eslint-disable react/jsx-one-expression-per-line */
import moment from 'moment';
import React from 'react';
import {IList, IListCell, ProjectListFilters} from '../../controls/table/table-models';
import {Features, IFeature, IFeatureBuilderConfig} from '../../controls/feature/feature-models';
import {features} from '../../../trans';
import {IProjectModel, ProjectClientModel, ProjectStatus} from './IProjectModel';
import {FullProjectModel} from './FullProjectModel';
import {t, formatDate, tariffFormat, searchinize} from '../../utils';
import {EditIcon} from '../../controls/Icon';
import {InvoiceClientCell} from '../../invoice/invoice-table/InvoiceClientCell';
import { ConsultantLinkWithModal } from "../../consultant/controls/ConsultantLinkWithModal";
import {ConsultantCountFooter} from '../project-month-list/table/footers/ConsultantCountFooter';
import { ProjectClientForecastFooter } from "../project-month-list/table/footers/ProjectClientForecastFooter";
import {ProjectForecastPartnerFooter} from "../project-month-list/table/footers/ProjectForecastPartnerFooter";
import {getTariffs} from '../utils/getTariffs';
import {getProjectMarkup} from '../utils/getProjectMarkup';
import {ContractIcons} from '../../client/contract/ContractIcons';


export type ProjectFeatureBuilderConfig = IFeatureBuilderConfig<FullProjectModel, ProjectListFilters>;



const fullProjectSearch = (filters: ProjectListFilters, prj: FullProjectModel) => {
  const {consultant, partner, client, details} = prj;

  if (!filters.showInactive && prj.status === ProjectStatus.NotActiveAnymore) {
    return false;
  }

  if (!filters.freeText) {
    return true;
  }

  const freeText = searchinize(filters.freeText);
  if (searchinize(prj.details.client.ref || '').includes(freeText)) {
    return true;
  }

  if (searchinize(prj.details.partner?.ref || '').includes(freeText)) {
    return true;
  }

  const startDate = formatDate(details.startDate);
  const endDate = formatDate(details.endDate);

  return searchinize(
    `${consultant.name?.trim()} ${consultant.firstName?.trim()} ${consultant.name?.trim()} ${consultant.type}
    ${startDate} ${endDate} ${partner?.name?.trim()} ${client?.name}`,
  ).includes(freeText);
};



const getRowBackgroundColor = (prj: FullProjectModel): undefined | string => {
  const MONTHS_BEFORE_WARNING = 1;
  const MONTHS_BEFORE_INFO = 3;

  if (prj.status === ProjectStatus.NotYetActive) {
    return 'table-success';
  }

  if (prj.status === ProjectStatus.NotActiveAnymore || prj.status === ProjectStatus.RecentlyInactive) {
    return 'table-danger';
  }

  if (prj.details.endDate) {
    const monthsLeft = moment(prj.details.endDate).diff(moment(), 'months', true);

    if (monthsLeft < MONTHS_BEFORE_WARNING) {
      return 'table-warning';
    }
    if (monthsLeft < MONTHS_BEFORE_INFO) {
      return 'table-info';
    }
  }
  return undefined;
};


export const ProjectClientTariff = ({projectClient}: {projectClient: ProjectClientModel | undefined}) => {
  if (!projectClient) {
    return null;
  }

  const tariffs = getTariffs(projectClient);
  const rateTypeLabel = tariffs.rateType ? ` / ${t(`rates.perType.${tariffs.rateType}`)}` : null;
  return (
    <>
      {tariffFormat(tariffs.tariff)}
      {rateTypeLabel}
    </>
  );
};

export const ProjectMarkup = ({project}: {project: IProjectModel}) => {
  if (!project.partner) {
    return null;
  }

  const markup = getProjectMarkup(project);
  return (
    <div>
      <span>{tariffFormat(markup.amount)}</span>
      <span style={{float: 'right'}}>{markup.percentage.toFixed(0)}%</span>
    </div>
  );
};


const projectListConfig = (config: ProjectFeatureBuilderConfig): IList<FullProjectModel, ProjectListFilters> => {
  const list: IListCell<FullProjectModel>[] = [{
    key: 'consultant',
    header: 'project.consultant',
    value: p => <ConsultantLinkWithModal consultant={p.consultant} showType />,
    footer: (models: FullProjectModel[]) => <ConsultantCountFooter consultants={models.map(x => x.consultant)} />,
  }, {
    key: 'startDate',
    header: 'project.startDate',
    value: p => formatDate(p.details.startDate),
  }, {
    key: 'endDate',
    header: 'project.endDate',
    value: p => p.details.endDate && formatDate(p.details.endDate),
  }, {
    key: 'partner',
    header: 'project.partner.clientId',
    value: p => <InvoiceClientCell client={p.partner} />,
    footer: (models: FullProjectModel[]) => <ProjectForecastPartnerFooter models={models} />,
  }, {
    key: 'partnerTariff',
    header: 'project.partner.tariff',
    value: p => <ProjectClientTariff projectClient={p.details.partner} />,
  }, {
    key: 'client',
    header: 'project.client.clientId',
    value: p => <InvoiceClientCell client={p.client} />,
    footer: (models: FullProjectModel[]) => <ProjectClientForecastFooter models={models} />,
  }, {
    key: 'clientTariff',
    header: 'project.client.tariff',
    value: p => <ProjectClientTariff projectClient={p.details.client} />,
  }, {
    key: 'markup',
    header: 'projectMonth.markup',
    value: p => <ProjectMarkup project={p.details} />,
  // }, {
  //   key: 'clientRef',
  //   header: 'project.client.ref',
  //   value: p => p.details.client.ref && (
  //     <Ellipsis title={p.details.client.ref} width={100}>
  //       <ToClipboardLabel label={p.details.client.ref} />
  //     </Ellipsis>
  //   ),
  }, {
    key: 'contract',
    header: 'project.contract.contracts',
    value: p => <ContractIcons project={p.details} client={p.client} />,
  }, {
    key: 'buttons',
    header: {title: '', width: 110},
    value: m => (
      <>
        <EditIcon onClick={`/projects/${m._id}`} style={{marginRight: 15}} size={1} />
      </>
    ),
  }];

  return {
    rows: {
      className: getRowBackgroundColor,
      cells: list,
    },
    data: config.data,
    sorter: (a, b) => {
      // Not active anymore -> complete bottom
      if (a.status !== b.status) {
        if (a.status === ProjectStatus.NotActiveAnymore) {
          return 1;
        }
        if (b.status === ProjectStatus.NotActiveAnymore) {
          return -1;
        }
      }


      // Without end date -> bottom of the list
      if (!a.details.endDate && !b.details.endDate) {
        return startDateSort(a, b);
      }
      if (!a.details.endDate) {
        return 1;
      }
      if (!b.details.endDate) {
        return -1;
      }


      // Sort on endDate, startDate, consultantName
      if (a.details.endDate.valueOf() === b.details.endDate.valueOf()) {
        return startDateSort(a, b);
      }
      return a.details.endDate.valueOf() - b.details.endDate.valueOf();
    },
  };
};

const startDateSort = (a: FullProjectModel, b: FullProjectModel): number => {
  if (a.details.startDate.valueOf() === b.details.startDate.valueOf()) {
    return a.consultant.firstName.localeCompare(b.consultant.firstName);
  }
  return a.details.startDate.valueOf() - b.details.startDate.valueOf();
};


export const projectFeature = (config: ProjectFeatureBuilderConfig): IFeature<FullProjectModel, ProjectListFilters> => {
  const feature: IFeature<FullProjectModel, ProjectListFilters> = {
    key: Features.projects,
    nav: m => `/projects/${m === 'create' ? m : m.details._id}`,
    trans: features.project as any,
    list: projectListConfig(config),
  };

  feature.list.filter = {
    state: config.filters,
    updateFilter: config.setFilters,
    fullTextSearch: fullProjectSearch,
    softDelete: true,
  };

  return feature;
};
