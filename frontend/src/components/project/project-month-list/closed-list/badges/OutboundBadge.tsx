import React from 'react';
import { t } from '../../../../utils';
import { ProjectMonthBadgeTotals } from "../ProjectMonthBadgeTotals";
import {Tooltip} from "../../../../controls/Tooltip";

/** ProjectMonth closed month Outbound badge */
export const OutboundBadge = ({ totals }: { totals: ProjectMonthBadgeTotals; }) => {
  return (
    <Tooltip title={`<b>${t('projectMonth.outboundPaid')}</b><br>` + totals.unverified}>
      <span className="badge rounded-pill bg-warning">
        <i className="fa fa-coins fa-1x" />
        {t('projectMonth.list.verifiedBadge', {verified: totals.verified, total: totals.total})}
      </span>
    </Tooltip>
  );
};
