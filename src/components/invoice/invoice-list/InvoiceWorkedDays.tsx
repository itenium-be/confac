import React from 'react';
import {t} from '../../utils';
import InvoiceModel, {calculateDaysWorked, DaysWorked} from '../models/InvoiceModel';

type InvoiceWorkedDaysProps = {
  invoices: InvoiceModel[],
  display?: 'month' | 'client' | 'invoice',
}

// eslint-disable-next-line react/prefer-stateless-function
export const InvoiceWorkedDays = ({invoices = [], display = 'month', ...props}: InvoiceWorkedDaysProps) => {
  const days = calculateDaysWorked(invoices);

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
