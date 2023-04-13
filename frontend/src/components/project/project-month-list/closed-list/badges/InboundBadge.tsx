import React from 'react';
import {t} from '../../../../utils';
import {TimesheetBadgeProps} from './TimesheetBadge';

import './InboundBadge.scss';
import {Tooltip} from "../../../../controls/Tooltip";

const AllInboundPaidBadge = (
  <span className="badge rounded-pill text-white bg-success">
    <i className="fa fa-inbox fa-1x"/>
    {t('projectMonth.list.inboundAllPaid')}
  </span>
);


/** ProjectMonth closed month Inbound badge */
export const InboundBadge = ({pending, totals}: TimesheetBadgeProps) => {
  if (!pending) {
    return AllInboundPaidBadge;
  }

  return (
    <span className="badge rounded-pill bg-warning inbound-badges">
      <Tooltip title={totals.inboundNew && `<b>${t('projectMonth.inboundNew')}</b><br>${totals.inboundNew}`}>
        <i className="fa fa-inbox fa-1x">
            <span>{totals.inboundNewCount}</span>
        </i>
      </Tooltip>

      <Tooltip
        title={totals.inboundValidated && `<b>${t('projectMonth.inboundValidated')}</b><br>${totals.inboundValidated}`}>
        <i className="fa fa-check fa-1x">
          <span>{totals.inboundValidatedCount}</span>
        </i>
      </Tooltip>

      <Tooltip
        title={totals.inboundPaid && `<b>${t('projectMonth.inboundPaid')}</b><br>${totals.inboundPaid}`}>
       <i className="fa fa-coins fa-1x">
        <span>{totals.inboundPaidCount}</span>
        </i>
      </Tooltip>
    </span>
  )
};
