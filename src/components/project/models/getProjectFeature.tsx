/* eslint-disable react/jsx-one-expression-per-line */
import moment from 'moment';
import React from 'react';
import {Link} from 'react-router-dom';
import {IList, IListCell} from '../../controls/table/table-models';
import {IFeature} from '../../controls/feature/feature-models';
import {features} from '../../../trans';
import {FullProjectModel} from './ProjectModel';
import {t, formatDate, tariffFormat, searchinize} from '../../utils';
import {ProjectFilters} from '../../../models';


export type ProjectFeature = {
  projects: FullProjectModel[];
}

const fullProjectSearch = (filters: ProjectFilters, prj: FullProjectModel) => {
  const {consultant, partner, client, details} = prj;

  if (!filters.isShowingInActiveProjects && !details.isActive) {
    return false;
  }

  if (!filters.searchFilterText) {
    return true;
  }

  const startDate = formatDate(details.startDate);
  const endDate = formatDate(details.endDate);

  return searchinize(
    `${consultant.name} ${consultant.firstName} ${consultant.type} ${startDate} ${endDate} ${partner && partner.name} ${client.name}`,
  ).includes(filters.searchFilterText.toLowerCase());
};



const getRowBackgroundColor = (prj: FullProjectModel): undefined | string => {
  const projectDetails = prj.details;
  if (!prj.details.isActive) {
    return 'table-danger';
  }

  if (projectDetails.endDate) {
    const monthsLeft = moment(projectDetails.endDate).diff(moment(), 'months', true);

    if (monthsLeft < 1) {
      return 'table-warning';
    }
    if (monthsLeft < 3) {
      return 'table-info';
    }
  }
  return undefined;
};


const projectListConfig = (config: ProjectFeature): IList<FullProjectModel, ProjectFilters> => {
  const list: IListCell<FullProjectModel>[] = [{
    key: 'consultant',
    header: 'project.consultant',
    value: p => (
      <Link to={`consultants/${p.consultant.slug}`}>
        {p.consultant.firstName} {p.consultant.name}
      </Link>
    ),
  }, {
    key: 'type',
    header: 'project.consultantType',
    value: p => t(`consultant.types.${p.consultant.type}`),
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
    header: 'project.partner',
    value: p => p.partner && p.partner.name,
  }, {
    key: 'partnerTariff',
    header: 'project.partnerTariff',
    value: p => tariffFormat(p.details.partnerTariff),
  }, {
    key: 'client',
    header: 'project.client',
    value: p => p.client && p.client.name,
  }, {
    key: 'clientTariff',
    header: 'project.clientTariff',
    value: p => tariffFormat(p.details.clientTariff),
  }];

  return {
    rows: {
      className: getRowBackgroundColor,
      cells: list,
    },
    data: config.projects,
    sorter: (a, b) => +a.details.endDate - +b.details.endDate,
    filter: {
      fullTextSearch: fullProjectSearch,
    },
  };
};


export const projectFeature = (config: ProjectFeature): IFeature<FullProjectModel, ProjectFilters> => {
  return {
    nav: m => `/projects/${m === 'create' ? m : m.details._id}`,
    trans: features.project as any,
    list: projectListConfig(config),
  };
};
