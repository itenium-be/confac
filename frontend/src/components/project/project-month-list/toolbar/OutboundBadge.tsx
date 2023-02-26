import React from 'react';
import { t } from '../../../utils';
import { Icon } from '../../../controls/Icon';
import { ProjectMonthTotals } from "./ProjectMonthTotals";
import { ProjectMonthBadge } from "./ProjectMonthBadge";

/** ProjectMonth closed month Outbound badge */
export const OutboundBadge = ({ totals }: { totals: ProjectMonthTotals; }) => {
  const title = totals.unverified
    .map(x => `${x.consultant.firstName} ${x.consultant.name} (${x.client.name})`)
    .filter((val, index, arr) => arr.indexOf(val) === index)
    .join('<br>');

  return (
    <ProjectMonthBadge pill bg="warning">
      <Icon fa="fa fa-coins" size={1} title={`<b>${t('projectMonth.outboundPaid')}</b><br>` + title} />
      {t('projectMonth.list.verifiedBadge', totals)}
    </ProjectMonthBadge>
  );
};
