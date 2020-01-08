import React, { CSSProperties } from 'react';
import moment from 'moment';

import { t, moneyFormat, formatDate } from '../utils';
import { FullProjectModel, ProjectDetailsModel } from './models';


export const ProjectsListHeader = () => (
  <thead>
    <tr>
      <th>{t('project.consultant')}</th>
      <th>{t('project.consultantType')}</th>
      <th>{t('project.startDate')}</th>
      <th>{t('project.endDate')}</th>
      <th>{t('project.partner')}</th>
      <th>{t('project.partnerTariff')}</th>
      <th>{t('project.client')}</th>
      <th>{t('project.clientTariff')}</th>
      <th>&nbsp;</th>
    </tr>
  </thead>
);


type ProjectsListRowProps = {
  project: FullProjectModel,
}

const ProjectsListRow = (props: ProjectsListRowProps) => {
  const tst = (key: string): string => `project-${key}`;

  const { details, partner, client, consultant } = props.project

  const setRowBackgroundColor = (projectDetails: ProjectDetailsModel): CSSProperties => {
    if (projectDetails.endDate) {
      const monthsLeft = moment(projectDetails.endDate).diff(moment(), 'months', true)

      if (monthsLeft < 1) return { backgroundColor: '#faad14' }
      if (monthsLeft < 3) return { backgroundColor: '#f5222d' }
    }
    return {}
  }

  return (
    <tr data-tst={tst('row')} style={setRowBackgroundColor(details)} >
      <td>
        <span data-tst={tst('consultant')}>{consultant.name}</span>
      </td>
      <td>
        <span data-tst={tst('type')}>{t(`consultant.types.${consultant.type}`)}</span>
      </td>
      <td>
        <span data-tst={tst('startDate')}>{formatDate(details.startDate)}</span>
      </td>
      <td>
        <span data-tst={tst('endDate')}>{details.endDate ? formatDate(details.endDate) : '/'}</span>
      </td>
      <td>
        <span data-tst={tst('partner')}>{partner ? partner.name : '/'}</span>
      </td>
      <td style={{ textAlign: 'right' }}>
        <span data-tst={tst('partnerTariff')}>{moneyFormat(details.partnerTariff)}</span>
      </td>
      <td>
        <span data-tst={tst('client')}>{client.name}</span>
      </td>
      <td style={{ textAlign: 'right' }}>
        <span data-tst={tst('clientTariff')}>{moneyFormat(details.clientTariff)}</span>
      </td>
    </tr >
  );
}

export default ProjectsListRow;
