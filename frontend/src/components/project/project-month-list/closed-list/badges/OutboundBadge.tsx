import React from 'react';
import { t } from '../../../../utils';
import { ProjectMonthBadgeTotals } from "../ProjectMonthBadgeTotals";

/** ProjectMonth closed month Outbound badge */
export const OutboundBadge = ({ totals }: { totals: ProjectMonthBadgeTotals; }) => {
  return (
    <span
      className="badge rounded-pill bg-warning"
      title={`<b>${t('projectMonth.outboundPaid')}</b><br>` + totals.unverified}
    >
      <i className="fa fa-coins fa-1x" />
      {t('projectMonth.list.verifiedBadge', {verified: totals.verified, total: totals.total})}
    </span>
  );
};
