import React from 'react';
import { Badge } from 'react-bootstrap';
import { t } from '../../../../utils';
import { Icon } from '../../../../controls/Icon';
import { ProjectMonthBadgeTotals } from "../ProjectMonthBadgeTotals";

export type TimesheetBadgeProps = {
  pending: boolean;
  totals: ProjectMonthBadgeTotals;
};

/** ProjectMonth closed month Timesheet badge */
export const TimesheetBadge = ({ pending, totals }: TimesheetBadgeProps) => {
  return (
    <Badge pill bg={pending ? 'warning' : 'success'} text={pending ? undefined : 'white'}>
      <Icon fa="fa fa-clock" size={1} title={`<b>${t('projectMonth.timesheetValidated')}</b><br>` + totals.timesheetPending} />
      {t(`projectMonth.list.${pending ? 'timesheetPending' : 'timesheetOk'}`, {timesheetPendingCount: totals.timesheetPendingCount})}
    </Badge>
  );
};
