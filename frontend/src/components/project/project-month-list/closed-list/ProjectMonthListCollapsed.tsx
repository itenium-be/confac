import React, { useMemo } from 'react';
import moment from 'moment';
import { Badge } from 'react-bootstrap';
import { displayMonthWithYear } from "../project-month-utils";
import {t} from '../../../utils';
import {Icon} from '../../../controls/Icon';
import { TimesheetBadge } from './badges/TimesheetBadge';
import { InboundBadge } from './badges/InboundBadge';
import { OutboundBadge } from './badges/OutboundBadge';
import { createProjectMonthBadgesSelector } from './createProjectMonthBadgesSelector';
import { useSelector } from 'react-redux';
import { ToggleProjectMonthButton } from '../ToggleProjectMonthButton';


/** ProjectMonth when the list is not visible, displaying badges */
export const ProjectMonthListCollapsed = ({month}: {month: string}) => {
  // PERF: File 3: useMemo on our createSelector:
  const selectProjectMonthBadges = useMemo(createProjectMonthBadgesSelector, []);
  const totals = useSelector((state) => selectProjectMonthBadges(state, month));

  const allVerified = totals.verified === totals.total;
  const hasTimesheetPending = totals.timesheetPending.length !== 0;
  const hasInboundPending = totals.inboundPending.length !== 0
  return (
    <>
      <h2 className="list-projectMonths-collapsed">
        <ToggleProjectMonthButton month={month} toggleOpen={true} />
        <span className="month">{displayMonthWithYear(moment(month))}</span>
        <span className="separate">
          {allVerified ? (
            <Badge pill bg="success" text="white">
              <Icon fa="fa fa-coins" size={1} />
              {t('projectMonth.list.allVerifiedBadge')}
            </Badge>
          ) : (
            <>
              <TimesheetBadge totals={totals} pending={hasTimesheetPending} />
              <InboundBadge totals={totals} pending={hasInboundPending} />
              <OutboundBadge totals={totals} />
            </>
          )}
        </span>
      </h2>
    </>
  );
};
