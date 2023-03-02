import React from 'react';
import { Badge } from 'react-bootstrap';
import { t } from '../../../../utils';
import { Icon } from '../../../../controls/Icon';
import { ProjectMonthBadgeTotals } from "../ProjectMonthBadgeTotals";

/** ProjectMonth closed month Outbound badge */
export const OutboundBadge = ({ totals }: { totals: ProjectMonthBadgeTotals; }) => {
  return (
    <Badge pill bg="warning">
      <Icon
        fa="fa fa-coins"
        size={1}
        title={`<b>${t('projectMonth.outboundPaid')}</b><br>` + totals.unverified}
      />
      {t('projectMonth.list.verifiedBadge', {verified: totals.verified, total: totals.total})}
    </Badge>
  );
};