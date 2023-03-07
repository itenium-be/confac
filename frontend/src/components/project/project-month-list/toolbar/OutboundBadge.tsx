import React from 'react';
import { t } from '../../../utils';
import { Icon } from '../../../controls/Icon';
import { ProjectMonthTotals } from "./ProjectMonthTotals";
import { ProjectMonthBadge } from "./ProjectMonthBadge";

/** ProjectMonth closed month Outbound badge */
export const OutboundBadge = ({ totals }: { totals: ProjectMonthTotals; }) => {
  return (
    <ProjectMonthBadge pill bg="warning">
      <Icon fa="fa fa-coins" size={1} title={`<b>${t('projectMonth.outboundPaid')}</b><br>` + totals.unverified} />
      {t('projectMonth.list.verifiedBadge', {verified: totals.verified, total: totals.total})}
    </ProjectMonthBadge>
  );
};
