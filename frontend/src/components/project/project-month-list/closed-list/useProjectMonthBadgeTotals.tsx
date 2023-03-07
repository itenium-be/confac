import { useSelector } from 'react-redux';
import { createSelector } from 'reselect'
import moment from 'moment';
import { ProjectMonthBadgeTotals } from './ProjectMonthBadgeTotals';
import { ConfacState } from '../../../../reducers/app-state';


/** Calculates the totals needed for rendering the badges */
export function useProjectMonthBadgeTotals(month: moment.Moment): ProjectMonthBadgeTotals {
  const confacState = useSelector((state: ConfacState) => state);
  const memoizedTotals = createSelector(
    (state: ConfacState) => state.projectsMonth,
    (state: ConfacState) => state.projects,
    (state: ConfacState) => state.consultants,
    (state: ConfacState) => state.clients,
    (projectsMonth, projects, consultants, clients) => {
      const projectMonths = projectsMonth
        .filter(x => x.month.isSame(moment(month), 'month') && x.verified !== 'forced')
        .map(projectMonth => {
          const project = projects.find(x => x._id === projectMonth.projectId);
          const consultant = project?.consultantId && consultants.find(x => x._id === project?.consultantId);
          const client = clients.find(x => x._id === project?.client?.clientId);
          const clientName = client ? ` (${client.name})` : '';
          const result = {
            verified: projectMonth.verified,
            timesheet: projectMonth.timesheet,
            inbound: projectMonth.inbound,
            hasInboundInvoice: project?.projectMonthConfig?.inboundInvoice || false,
            consultant: consultant && `${consultant.firstName} ${consultant.name}${clientName}`
          };
          return result;
        });


      const mapToConsultantNames = (arr: any[]) => arr
        .map(x => x.consultant)
        .filter((val, index, arr) => arr.indexOf(val) === index)
        .join('<br>');

      const timesheetPending = projectMonths.filter(x => !x.timesheet.validated);
      const withInbound = projectMonths.filter(x => x.hasInboundInvoice);
      const inboundNew = withInbound.filter(x => x.inbound.status === 'new');
      const inboundValidated = withInbound.filter(x => x.inbound.status === 'validated');
      const inboundPaid = withInbound.filter(x => x.inbound.status === 'paid');

      const totals: ProjectMonthBadgeTotals = {
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
      return totals;
    }
  );

  return memoizedTotals(confacState);
}
