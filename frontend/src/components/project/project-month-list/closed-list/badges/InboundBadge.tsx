import React from 'react';
import { t } from '../../../../utils';
import { TimesheetBadgeProps } from './TimesheetBadge';

import './InboundBadge.scss';

const AllInboundPaidBadge = (
  <span className="badge rounded-pill text-white bg-success">
    <i className="fa fa-inbox fa-1x" />
    {t('projectMonth.list.inboundAllPaid')}
  </span>
);


/** ProjectMonth closed month Inbound badge */
export const InboundBadge = ({ pending, totals }: TimesheetBadgeProps) => {
  if (!pending) {
    return AllInboundPaidBadge;
  }

  return (
    <span className="badge rounded-pill bg-warning inbound-badges">
      <i
        className="fa fa-inbox fa-1x"
        title={totals.inboundNew && `<b>${t('projectMonth.inboundNew')}</b><br>${totals.inboundNew}`}
      >
        <span>{totals.inboundNewCount}</span>
      </i>

      <i
        className="fa fa-check fa-1x"
        title={totals.inboundValidated && `<b>${t('projectMonth.inboundValidated')}</b><br>${totals.inboundValidated}`}
      >
        <span>{totals.inboundValidatedCount}</span>
      </i>

      <i
        className="fa fa-coins fa-1x"
        title={totals.inboundPaid && `<b>${t('projectMonth.inboundPaid')}</b><br>${totals.inboundPaid}`}
      >
        <span>{totals.inboundPaidCount}</span>
      </i>
    </span>
  )
};
