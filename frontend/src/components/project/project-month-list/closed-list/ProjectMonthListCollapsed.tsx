import React, { Profiler, useMemo } from 'react';
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
  const selectProjectMonthBadges = useMemo(createProjectMonthBadgesSelector, []);
  const totals = useSelector((state) => selectProjectMonthBadges(state, month));

  const allVerified = totals.verified === totals.total;
  const hasTimesheetPending = totals.timesheetPending.length !== 0;
  const hasInboundPending = totals.inboundPending.length !== 0;


  function callback(
    id, // the "id" prop of the Profiler tree that has just committed
    phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration, // time spent rendering the committed update
    baseDuration, // estimated time to render the entire subtree without memoization
    startTime, // when React began rendering this update
    commitTime, // when React committed this update
    interactions // the Set of interactions belonging to this update
  ) {
    console.log(`${id}: ${phase} in ${actualDuration}`);
  }

  return (
    <>
      <h2 className="list-projectMonths-collapsed">
        <Profiler id="ProjectMonthListCollapsed" onRender={callback}>
          <Profiler id="ToggleProjectMonthButton" onRender={callback}>
            <ToggleProjectMonthButton month={month} toggleOpen={true} />
          </Profiler>


          <Profiler id="displayMonthWithYear" onRender={callback}>
            <span className="month">{displayMonthWithYear(moment(month))}</span>
          </Profiler>


          <Profiler id="Badges" onRender={callback}>
            <span className="separate">
              {allVerified ? (
                <Badge pill bg="success" text="white">
                  <Icon fa="fa fa-coins" size={1} />
                  {t('projectMonth.list.allVerifiedBadge')}
                </Badge>
              ) : (
                <>
                  <Profiler id="TimesheetBadge" onRender={callback}>
                    <TimesheetBadge totals={totals} pending={hasTimesheetPending} />
                  </Profiler>
                  <Profiler id="InboundBadge" onRender={callback}>
                    <InboundBadge totals={totals} pending={hasInboundPending} />
                  </Profiler>
                  <Profiler id="OutboundBadge" onRender={callback}>
                    <OutboundBadge totals={totals} />
                  </Profiler>
                </>
              )}
            </span>
          </Profiler>
        </Profiler>
      </h2>
    </>
  );
};
