import React from 'react';
import { FullProjectMonthModel } from '../../models/FullProjectMonthModel';
import { t } from '../../../utils';
import { Icon } from '../../../controls/Icon';
import { TimesheetBadgeProps } from './TimesheetBadge';
import { ProjectMonthBadge } from "./ProjectMonthBadge";

const inboundBadgeMap = (models: FullProjectMonthModel[]): string => {
  return models
    .map(x => `${x.consultant.firstName} ${x.consultant.name}`)
    .filter((val, index, arr) => arr.indexOf(val) === index)
    .join('<br>');
};

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

  const newTitle = inboundBadgeMap(totals.inboundNew);
  const validatedTitle = inboundBadgeMap(totals.inboundValidated);
  const paidTitle = inboundBadgeMap(totals.inboundPaid);
  return (
    <ProjectMonthBadge pill bg="warning">
      <Icon fa="fa fa-inbox" size={1} title={newTitle && `<b>${t('projectMonth.inboundNew')}</b><br>${newTitle}`}>
        {totals.inboundNew.length}
      </Icon>

      <Icon fa="fa fa-check" size={1} title={validatedTitle && `<b>${t('projectMonth.inboundValidated')}</b><br>${validatedTitle}`}>
        {totals.inboundValidated.length}
      </Icon>


      <Icon fa="fa fa-coins" size={1} title={paidTitle && `<b>${t('projectMonth.inboundPaid')}</b><br>${paidTitle}`}>
        {totals.inboundPaid.length}
      </Icon>
    </ProjectMonthBadge>
  );
};
