import React from 'react';
import moment from 'moment';
import {displayMonthWithYear} from '../../ProjectMonthsLists';
import {Button} from '../../../controls/form-controls/Button';
import {t} from '../../../utils';
import {Icon} from '../../../controls/Icon';
import { TimesheetBadge } from './TimesheetBadge';
import { InboundBadge } from './InboundBadge';
import { OutboundBadge } from './OutboundBadge';
import { ProjectMonthBadge } from './ProjectMonthBadge';
import { ProjectMonthTotals } from './ProjectMonthTotals';
import { ConfacState } from '../../../../reducers/app-state';
import { useSelector } from 'react-redux';


type ProjectMonthListCollapsedProps = {
  /** Format YYYY-MM */
  month: string;
  onOpen: () => void;
}


export const ProjectMonthListCollapsed = ({month, onOpen}: ProjectMonthListCollapsedProps) => {
  const projectMonths = useSelector((state: ConfacState) => state.projectsMonth
    .filter(x => x.month.isSame(moment(month), 'month') && x.verified !== 'forced')
    .map(projectMonth => {
      const project = state.projects.find(x => x._id === projectMonth.projectId);
      const consultant = project?.consultantId && state.consultants.find(x => x._id === project?.consultantId);
      const client = state.clients.find(x => x._id === project?.client?.clientId);
      const clientName = client ? ` (${client.name})` : '';
      const result = {
        verified: projectMonth.verified,
        timesheet: projectMonth.timesheet,
        inbound: projectMonth.inbound,
        hasInboundInvoice: project?.projectMonthConfig?.inboundInvoice || false,
        consultant: consultant && `${consultant.firstName} ${consultant.name}${clientName}`
      };

      return result;
    })
    .filter(x => x !== null)
  );

  if (!projectMonths.length) {
    return null;
  }


  const mapToConsultantNames = (arr: any[]) => arr
  .map(x => x.consultant)
  .filter((val, index, arr) => arr.indexOf(val) === index)
  .join('<br>');

  const timesheetPending = projectMonths.filter(x => !x.timesheet.validated);
  const withInbound = projectMonths.filter(x => x.hasInboundInvoice);
  const inboundNew = withInbound.filter(x => x.inbound.status === 'new');
  const inboundValidated = withInbound.filter(x => x.inbound.status === 'validated');
  const inboundPaid = withInbound.filter(x => x.inbound.status === 'paid');

  const totals: ProjectMonthTotals = {
    total: projectMonths.length,
    verified: projectMonths.filter(x => x.verified).length,
    unverified: mapToConsultantNames(projectMonths.filter(x => !x.verified)),
    timesheetPending: mapToConsultantNames(timesheetPending),
    timesheetPendingCount: timesheetPending.length,
    inboundPending: mapToConsultantNames(withInbound.filter(x => x.inbound.status !== 'paid')),
    inboundNew: mapToConsultantNames(inboundNew),
    inboundNewCount: inboundNew.length,
    inboundValidated: mapToConsultantNames(inboundValidated),
    inboundValidatedCount: inboundValidated.length,
    inboundPaid: mapToConsultantNames(inboundPaid),
    inboundPaidCount: inboundPaid.length,
  };

  const results = {
    verified: totals.verified === totals.total,
    timesheetPending: totals.timesheetPending.length !== 0,
    inboundPending: totals.inboundPending.length !== 0,
  };

  return (
    <>
      <h2 className="list-projectMonths-collapsed">
        <Button onClick={onOpen} icon="fa fa-toggle-off" variant="outline-info">
          {t('projectMonth.list.openList')}
        </Button>
        <span className="month">{displayMonthWithYear(moment(month))}</span>
        <span className="separate">
          {results.verified ? (
            <ProjectMonthBadge pill bg="success" text="white">
              <Icon fa="fa fa-coins" size={1} />
              {t('projectMonth.list.allVerifiedBadge')}
            </ProjectMonthBadge>
          ) : (
            <>
              <TimesheetBadge totals={totals} pending={results.timesheetPending} />
              <InboundBadge totals={totals} pending={results.inboundPending} />
              <OutboundBadge totals={totals} />
            </>
          )}
        </span>
      </h2>
    </>
  );
};
