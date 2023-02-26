import React from 'react';
import {displayMonthWithYear} from '../../ProjectMonthsLists';
import {IFeature} from '../../../controls/feature/feature-models';
import {FullProjectMonthModel} from '../../models/FullProjectMonthModel';
import {ProjectMonthListFilters} from '../../../controls/table/table-models';
import {Button} from '../../../controls/form-controls/Button';
import {t} from '../../../utils';
import {Icon} from '../../../controls/Icon';
import { TimesheetBadge } from './TimesheetBadge';
import { InboundBadge } from './InboundBadge';
import { OutboundBadge } from './OutboundBadge';
import { ProjectMonthBadge } from './ProjectMonthBadge';
import { ProjectMonthTotals } from './ProjectMonthTotals';


type ProjectMonthListCollapsedProps = {
  feature: IFeature<FullProjectMonthModel, ProjectMonthListFilters>;
  onOpen: () => void;
}


export const ProjectMonthListCollapsed = ({feature, onOpen}: ProjectMonthListCollapsedProps) => {
  if (!feature.list.data.length) {
    return null;
  }

  const data = feature.list.data.filter(x => x.details.verified !== 'forced');
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

  const projectsMonthDetails = feature.list.data[0].details;
  return (
    <>
      <h2 className="list-projectMonths-collapsed">
        <Button onClick={onOpen} icon="fa fa-toggle-off" variant="outline-info">
          {t('projectMonth.list.openList')}
        </Button>
        <span className="month">{displayMonthWithYear(projectsMonthDetails)}</span>
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
