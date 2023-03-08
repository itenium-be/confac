import React, { Profiler, useMemo } from 'react';
import moment from 'moment';
import { displayMonthWithYear } from "../project-month-utils";
import {t} from '../../../utils';
import { TimesheetBadge } from './badges/TimesheetBadge';
import { InboundBadge } from './badges/InboundBadge';
import { OutboundBadge } from './badges/OutboundBadge';
import { createProjectMonthBadgesSelector } from './createProjectMonthBadgesSelector';
import { useSelector } from 'react-redux';
import { ToggleProjectMonthButton } from '../ToggleProjectMonthButton';


// PERF: This is a bit 'cheating', we cannot cache the badge COMPLETELY like this
// PERF: If the language changes, the label should also change!
// PERF: Thank god confac only has one language!
const VerifiedBadge = (
  <span className="badge rounded-pill text-white bg-success">
    <i className="fa fa-coins fa-1x" />
    {t('projectMonth.list.allVerifiedBadge')}
  </span>
);


type ITiming = {
  renders: number;
  totalTime: number;
  averageTime?: number;
}

let timings: {[key: string]: ITiming} = {}


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
    // console.log(`${id}: ${phase} in ${actualDuration}`);
    if (id.startsWith('Badge')) {
      id = 'NotVerifiedBadges'
    }

    if (!timings[id]) {
      timings[id] = {renders: 1, totalTime: actualDuration};
    } else {
      const oldTimings = timings[id];
      timings[id] = {renders: oldTimings.renders + 1, totalTime: oldTimings.totalTime + actualDuration};
    }

    timings[id].averageTime = timings[id].totalTime / timings[id].renders;
  }


  console.log(timings); // TODO: useDebugValue?

  // PERF: the badges below are now reduced to their absolute minimum
  // PERF: See for example Icon.tsx why this takes so long to render.
  return (
    <>
      <h2 className="list-projectMonths-collapsed">
        <Profiler id="ProjectMonthListCollapsed" onRender={callback}>
          <Profiler id="ToggleProjectMonthButton" onRender={callback}>
            <ToggleProjectMonthButton month={month} toggleOpen={true} />
          </Profiler>


          <span className="month">{displayMonthWithYear(moment(month))}</span>


          <span className="separate">
            {allVerified ? (
              <Profiler id="VerifiedBadge" onRender={callback}>
                {VerifiedBadge}
              </Profiler>
            ) : (
              <>
                <Profiler id="BadgeTimesheet" onRender={callback}>
                  <TimesheetBadge totals={totals} pending={hasTimesheetPending} />
                </Profiler>
                <Profiler id="BadgeInbound" onRender={callback}>
                  <InboundBadge totals={totals} pending={hasInboundPending} />
                </Profiler>
                <Profiler id="BadgeOutbound" onRender={callback}>
                  <OutboundBadge totals={totals} />
                </Profiler>
              </>
            )}
          </span>
        </Profiler>
      </h2>
    </>
  );
};
