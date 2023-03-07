import React from 'react';
import { t } from '../../../utils';
import { Icon } from '../../../controls/Icon';
import { TimesheetBadgeProps } from './TimesheetBadge';
import { ProjectMonthBadge } from "./ProjectMonthBadge";


/** ProjectMonth closed month Inbound badge */
export const InboundBadge = ({ pending, totals }: TimesheetBadgeProps) => {
  if (!pending) {
    return (
      <ProjectMonthBadge pill bg="success" text="white">
        <Icon fa="fa fa-inbox" size={1} />
        {t('projectMonth.list.inboundAllPaid')}
      </ProjectMonthBadge>
    );
  }

  return (
    <ProjectMonthBadge pill bg="warning">
      <Icon fa="fa fa-inbox" size={1} title={totals.inboundNew && `<b>${t('projectMonth.inboundNew')}</b><br>${totals.inboundNew}`}>
        {totals.inboundNewCount}
      </Icon>

      <Icon fa="fa fa-check" size={1} title={totals.inboundValidated && `<b>${t('projectMonth.inboundValidated')}</b><br>${totals.inboundValidated}`}>
        {totals.inboundValidatedCount}
      </Icon>


      <Icon fa="fa fa-coins" size={1} title={totals.inboundPaid && `<b>${t('projectMonth.inboundPaid')}</b><br>${totals.inboundPaid}`}>
        {totals.inboundPaidCount}
      </Icon>
    </ProjectMonthBadge>
  );
};
