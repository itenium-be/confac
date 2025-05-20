import {createSelector} from 'reselect';
import {ProjectMonthBadgeTotals} from './ProjectMonthBadgeTotals';
import {ConfacState} from '../../../../reducers/app-state';
import {shallowEqual} from 'react-redux';


const selectProjectsMonth = (state: ConfacState) => state.projectsMonth;
const selectProjects = (state: ConfacState) => state.projects;
const selectConsultants = (state: ConfacState) => state.consultants;
const selectClients = (state: ConfacState) => state.clients;


const selectAllData = createSelector(
  [selectProjectsMonth, selectProjects, selectConsultants, selectClients],
  (projectsMonth, projects, consultants, clients) => ({
    projectsMonth, projects, consultants, clients
  }), {
    memoizeOptions: {resultEqualityCheck: shallowEqual}
  }
);


/** Calculates the totals needed for rendering the timesheet/inbound/outbound badges for one projectMonth */
export const createProjectMonthBadgesSelector = () => createSelector(
  [
    selectAllData,
    (_, month: string) => month
  ],
  ({projectsMonth, projects, consultants, clients}, month) => {
    const projectMonths = projectsMonth
      .filter(x => x.month.isSame(month, 'month') && x.verified !== 'forced')
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
      .filter((val, index, filterArr) => filterArr.indexOf(val) === index)
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
