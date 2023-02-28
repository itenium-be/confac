import React from 'react';
import {displayMonthWithYear} from '../../ProjectMonthsLists';
import {FullProjectMonthModel} from '../../models/FullProjectMonthModel';
import {Button} from '../../../controls/form-controls/Button';
import {t} from '../../../utils';
import {Icon} from '../../../controls/Icon';
import { TimesheetBadge } from './TimesheetBadge';
import { InboundBadge } from './InboundBadge';
import { OutboundBadge } from './OutboundBadge';
import { ProjectMonthBadge } from './ProjectMonthBadge';
import { ProjectMonthTotals } from './ProjectMonthTotals';
import { mapToProjectMonth } from '../../../hooks/useProjects';
import { ConfacState } from '../../../../reducers/app-state';
import { useSelector } from 'react-redux';
import moment from 'moment';


type ProjectMonthListCollapsedProps = {
  /** Format YYYY-MM */
  month: string;
  onOpen: () => void;
}


export const ProjectMonthListCollapsed = ({month, onOpen}: ProjectMonthListCollapsedProps) => {
  const projectMonths = useSelector((state: ConfacState) => state.projectsMonth
    .filter(x => x.month.isSame(moment(month), 'month'))
    .map(x => mapToProjectMonth(state, x))
    .filter(x => x !== null)
  ) as FullProjectMonthModel[];

  // const projectMonths2 = useSelector((state: ConfacState) => state.projectsMonth
  //   .filter(x => x.month.isSame(moment(month), 'month'))
  //   .map(projectMonth => {
  //     const result = {
  //       details: {}
  //     };
  //     return result;
  //   })
  //   .filter(x => x !== null)
  // ) as FullProjectMonthModel[];

  if (!projectMonths.length) {
    return null;
  }

  const data = projectMonths.filter(x => x.details.verified !== 'forced');
  const withInbound = data.filter(x => x.project.projectMonthConfig.inboundInvoice);

  const totals: ProjectMonthTotals = {
    total: data.length,
    verified: data.filter(x => x.details.verified).length,
    unverified: data.filter(x => !x.details.verified),
    timesheetPending: data.filter(x => !x.details.timesheet.validated),
    timesheetPendingCount: data.filter(x => !x.details.timesheet.validated).length,
    inboundPending: withInbound.filter(x => x.details.inbound.status !== 'paid'),
    inboundNew: withInbound.filter(x => x.details.inbound.status === 'new'),
    inboundValidated: withInbound.filter(x => x.details.inbound.status === 'validated'),
    inboundPaid: withInbound.filter(x => x.details.inbound.status === 'paid'),
  };

  const results = {
    verified: totals.verified === totals.total,
    timesheetPending: totals.timesheetPending.length !== 0,
    inboundPending: totals.inboundPending.length !== 0,
  };

  const projectsMonthDetails = projectMonths[0].details;
  return (
    <>
      <h2 className="list-projectMonths-collapsed">
        <Button onClick={onOpen} icon="fa fa-toggle-off" variant="outline-info">
          {t('projectMonth.list.openList')}
        </Button>
        <span className="month">{displayMonthWithYear(projectsMonthDetails.month)}</span>
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
