import React from 'react';
import moment from 'moment';
import { Badge } from 'react-bootstrap';
import { displayMonthWithYear } from "../project-month-utils";
import {Button} from '../../../controls/form-controls/Button';
import {t} from '../../../utils';
import {Icon} from '../../../controls/Icon';
import { TimesheetBadge } from './badges/TimesheetBadge';
import { InboundBadge } from './badges/InboundBadge';
import { OutboundBadge } from './badges/OutboundBadge';
import { useProjectMonthBadgeTotals } from './useProjectMonthBadgeTotals';


type ProjectMonthListCollapsedProps = {
  /** Format YYYY-MM */
  month: string;
  onOpen: () => void;
}


/** ProjectMonth when the list is not visible, displaying badges */
export const ProjectMonthListCollapsed = ({month, onOpen}: ProjectMonthListCollapsedProps) => {
  const totals = useProjectMonthBadgeTotals(moment(month));
  if (!totals) {
    return null;
  }

  const allVerified = totals.verified === totals.total;
  const hasTimesheetPending = totals.timesheetPending.length !== 0;
  const hasInboundPending = totals.inboundPending.length !== 0
  return (
    <>
      <h2 className="list-projectMonths-collapsed">
        <Button onClick={onOpen} icon="fa fa-toggle-off" variant="outline-info">
          {t('projectMonth.list.openList')}
        </Button>
        <span className="month">{displayMonthWithYear(moment(month))}</span>
        <span className="separate">
          {allVerified ? (
            <Badge pill bg="success" text="white">
              <Icon fa="fa fa-coins" size={1} />
              {t('projectMonth.list.allVerifiedBadge')}
            </Badge>
          ) : (
            <>
              <TimesheetBadge totals={totals} pending={hasTimesheetPending} />
              <InboundBadge totals={totals} pending={hasInboundPending} />
              <OutboundBadge totals={totals} />
            </>
          )}
        </span>
      </h2>
    </>
  );
};
