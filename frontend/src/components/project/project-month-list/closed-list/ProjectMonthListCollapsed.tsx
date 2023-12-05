import React, { useMemo } from 'react';
import moment from 'moment';
import { displayMonthWithYear } from "../project-month-utils";
import {t} from '../../../utils';
import { TimesheetBadge } from './badges/TimesheetBadge';
import { InboundBadge } from './badges/InboundBadge';
import { OutboundBadge } from './badges/OutboundBadge';
import { createProjectMonthBadgesSelector } from './createProjectMonthBadgesSelector';
import { useSelector } from 'react-redux';
import { ToggleProjectMonthButton } from '../ToggleProjectMonthButton';


const VerifiedBadge = (
  <span className="badge rounded-pill text-white bg-success">
    <i className="fa fa-coins fa-1x tst-icon-paid-valid" />
    {t('projectMonth.list.allVerifiedBadge')}
  </span>
);


/** ProjectMonth when the list is not visible, displaying badges */
export const ProjectMonthListCollapsed = ({month}: {month: string}) => {
  const selectProjectMonthBadges = useMemo(createProjectMonthBadgesSelector, []);
  const totals = useSelector((state) => selectProjectMonthBadges(state, month));

  const allVerified = totals.verified === totals.total;
  const hasTimesheetPending = totals.timesheetPending.length !== 0;
  const hasInboundPending = totals.inboundPending.length !== 0;

  return (
    <>
      <h2 className="list-projectMonths-collapsed">
        <ToggleProjectMonthButton month={month} toggleOpen={true} />
        <span className="month">{displayMonthWithYear(moment(month))}</span>

        <span className="separate">
          {allVerified ? VerifiedBadge : (
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
