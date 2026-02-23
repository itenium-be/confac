type ITiming = {
  renders: number;
  totalTime: number;
  averageTime?: number;
}


const timings: {[key: string]: ITiming} = {};


export function callback(
  id: string, // the "id" prop of the Profiler tree that has just committed
  phase: 'mount' | 'update', // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
  actualDuration: number, // time spent rendering the committed update
  _baseDuration: number, // estimated time to render the entire subtree without memoization
  _startTime: number, // when React began rendering this update
  _commitTime: number, // when React committed this update
  _interactions: Set<unknown> // the Set of interactions belonging to this update
) {
  // console.log(`${id}: ${phase} in ${actualDuration}`);
  if (id.startsWith('Badge')) {
    id = 'NotVerifiedBadges';
  }

  if (!timings[id]) {
    timings[id] = {renders: 1, totalTime: actualDuration};
  } else {
    const oldTimings = timings[id];
    timings[id] = {renders: oldTimings.renders + 1, totalTime: oldTimings.totalTime + actualDuration};
  }

  timings[id].averageTime = timings[id].totalTime / timings[id].renders;
}


// return (
//   <>
//     <h2 className="list-projectMonths-collapsed">
//       <Profiler id="ProjectMonthListCollapsed" onRender={callback}>
//         <Profiler id="ToggleProjectMonthButton" onRender={callback}>
//           <ToggleProjectMonthButton month={month} toggleOpen />
//         </Profiler>


//         <span className="month">{displayMonthWithYear(moment(month))}</span>


//         <span className="separate">
//           {allVerified ? (
//             <Profiler id="VerifiedBadge" onRender={callback}>
//               {VerifiedBadge}
//             </Profiler>
//           ) : (
//             <>
//               <Profiler id="BadgeTimesheet" onRender={callback}>
//                 <TimesheetBadge totals={totals} pending={hasTimesheetPending} />
//               </Profiler>
//               <Profiler id="BadgeInbound" onRender={callback}>
//                 <InboundBadge totals={totals} pending={hasInboundPending} />
//               </Profiler>
//               <Profiler id="BadgeOutbound" onRender={callback}>
//                 <OutboundBadge totals={totals} />
//               </Profiler>
//             </>
//           )}
//         </span>
//       </Profiler>
//     </h2>
//   </>
// );
