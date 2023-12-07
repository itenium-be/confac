import React from 'react';
import { t } from '../../../../utils';
import { ProjectMonthBadgeTotals } from "../ProjectMonthBadgeTotals";
import {Tooltip} from "../../../../controls/Tooltip";

export type TimesheetBadgeProps = {
  pending: boolean;
  totals: ProjectMonthBadgeTotals;
};


const TimeSheetOkBadge = (
  <span className="badge rounded-pill text-white bg-success">
    <i className="fa fa-clock fa-1x" />
    {t('projectMonth.list.timesheetOk')}
  </span>
)

/** ProjectMonth closed month Timesheet badge */
export const TimesheetBadge = ({ pending, totals }: TimesheetBadgeProps) => {
  if (!pending) {
    return TimeSheetOkBadge;
  }

  return (
    <Tooltip title={`<b>${t('projectMonth.timesheetValidated')}</b><br>` + totals.timesheetPending}>
      <span className="badge rounded-pill bg-warning">
        <i className="fa fa-clock fa-1x"  />
            {t('projectMonth.list.timesheetPending', {timesheetPendingCount: totals.timesheetPendingCount})}
      </span>
    </Tooltip>
  );
};
