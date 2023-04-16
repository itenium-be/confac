import {t} from '../../utils';
import InvoiceModel, {calculateDaysWorked, DaysWorked, getWorkDaysInMonths} from '../models/InvoiceModel';

type InvoiceWorkedDaysProps = {
  invoices: InvoiceModel[],
  display?: 'month' | 'client' | 'invoice',
}


export const InvoiceWorkedDays = ({invoices = [], display}: InvoiceWorkedDaysProps) => {
  const days = calculateDaysWorked(invoices);
  if (days.daysWorked === 0) {
    return null;
  }

  if (display === 'invoice') {
    return <span>{days.daysWorked.toFixed(1).replace('.', ',')}</span>;
  }

  if (display === 'month') {
    const workDaysInMonth = getWorkDaysInMonths(invoices);
    return (
      <span>
        <span>{days.daysWorked.toFixed(1).replace('.', ',')}</span>
        &nbsp;/&nbsp;
        <span>{workDaysInMonth}</span>
        &nbsp;(
        <span>{calcPer(days, workDaysInMonth)}</span>
        )
      </span>
    );
  }

  if (display === 'client') {
    return <span>{t('client.daysWorked', {days: days.daysWorked.toFixed(1).replace('.', ',')})}</span>;
  }

  return null;
};



/** Print % days worked in month */
function calcPer(days: DaysWorked, workDaysInMonth: number): string {
  return `${Math.round((days.daysWorked / workDaysInMonth) * 100)}%`;
}
