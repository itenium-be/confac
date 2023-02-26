import React from 'react';
import { t } from '../../../utils';
import { Icon } from '../../../controls/Icon';
import { ProjectMonthTotals } from "./ProjectMonthTotals";
import { ProjectMonthBadge } from "./ProjectMonthBadge";

export type TimesheetBadgeProps = {
  pending: boolean;
  totals: ProjectMonthTotals;
};

/** ProjectMonth closed month Timesheet badge */
export const TimesheetBadge = ({ pending, totals }: TimesheetBadgeProps) => {
  const title = totals.timesheetPending
    .map(x => `${x.consultant.firstName} ${x.consultant.name}`)
    .filter((val, index, arr) => arr.indexOf(val) === index)
    .join('<br>');

  return (
    <ProjectMonthBadge pill bg={pending ? 'warning' : 'success'} text={pending ? undefined : 'white'}>
      <Icon fa="fa fa-clock" size={1} title={`<b>${t('projectMonth.timesheetValidated')}</b><br>` + title} />
      {t(`projectMonth.list.${pending ? 'timesheetPending' : 'timesheetOk'}`, totals)}
    </ProjectMonthBadge>
  );
};
