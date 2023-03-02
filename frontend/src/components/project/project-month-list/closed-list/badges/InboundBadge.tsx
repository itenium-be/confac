import React from 'react';
import { Badge } from 'react-bootstrap';
import { t } from '../../../../utils';
import { Icon } from '../../../../controls/Icon';
import { TimesheetBadgeProps } from './TimesheetBadge';


/** ProjectMonth closed month Inbound badge */
export const InboundBadge = ({ pending, totals }: TimesheetBadgeProps) => {
  if (!pending) {
    return (
      <Badge pill bg="success" text="white">
        <Icon fa="fa fa-inbox" size={1} />
        {t('projectMonth.list.inboundAllPaid')}
      </Badge>
    );
  }

  return (
    <Badge pill bg="warning">
      <Icon
        fa="fa fa-inbox"
        size={1}
        title={totals.inboundNew && `<b>${t('projectMonth.inboundNew')}</b><br>${totals.inboundNew}`}
      >
        {totals.inboundNewCount}
      </Icon>

      <Icon
        fa="fa fa-check"
        size={1}
        title={totals.inboundValidated && `<b>${t('projectMonth.inboundValidated')}</b><br>${totals.inboundValidated}`}
      >
        <div style={{marginLeft: 8, display: 'inline-block'}}>{totals.inboundValidatedCount}</div>
      </Icon>


      <Icon
        fa="fa fa-coins"
        size={1}
        title={totals.inboundPaid && `<b>${t('projectMonth.inboundPaid')}</b><br>${totals.inboundPaid}`}
      >
        <div style={{marginLeft: 12, display: 'inline-block'}}>{totals.inboundPaidCount}</div>
      </Icon>
    </Badge>
  );
};
