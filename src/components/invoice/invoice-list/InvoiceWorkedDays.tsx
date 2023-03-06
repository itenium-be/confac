import React from 'react';
import {t} from '../../utils';
import InvoiceModel, {calculateDaysWorked, DaysWorked} from '../models/InvoiceModel';

type InvoiceWorkedDaysProps = {
  invoices: InvoiceModel[],
  display?: 'month' | 'client' | 'invoice',
}


export const InvoiceWorkedDays = ({invoices = [], ...props}: InvoiceWorkedDaysProps) => {
  // PERF: This is eating 1s for 100 renders
  const days = calculateDaysWorked(invoices);
  return <WorkedDays days={days} {...props} />;
};


type WorkedDaysProps = {
  days: DaysWorked & {workDaysInMonth: number},
  display?: 'month' | 'client' | 'invoice',
}


export const WorkedDays = ({days, display = 'month'}: WorkedDaysProps) => {
  if (days.daysWorked === 0) {
    return null;
  }

  if (display === 'invoice') {
    return <span>{days.daysWorked.toFixed(1).replace('.', ',')}</span>;
  }

  if (display === 'month') {
    return (
      <span>
        <span>{days.daysWorked.toFixed(1).replace('.', ',')}</span>
        &nbsp;/&nbsp;
        <span>{days.workDaysInMonth}</span>
        &nbsp;(
        <span>{calcPer(days)}</span>
        )
      </span>
    );
  }

  if (display === 'client') {
    return <span>{t('client.daysWorked', {days: days.daysWorked.toFixed(1).replace('.', ',')})}</span>;
  }

  return null;
};



/**
 * Print % days worked in month
 */
function calcPer(days: DaysWorked & { workDaysInMonth: number }): string {
  return `${Math.round((days.daysWorked / days.workDaysInMonth) * 100)}%`;
}
