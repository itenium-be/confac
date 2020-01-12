import React, {Component} from 'react';
import {t} from '../../utils';
import InvoiceModel, {calculateDaysWorked, DaysWorked} from '../models/InvoiceModel';

type InvoiceWorkedDaysProps = {
  invoices: InvoiceModel[],
  display: 'month' | 'client' | 'invoice',
}

// eslint-disable-next-line react/prefer-stateless-function
export class InvoiceWorkedDays extends Component<InvoiceWorkedDaysProps> {
  static defaultProps: InvoiceWorkedDaysProps = {
    invoices: [],
    display: 'month',
  }

  render() {
    const {invoices, display} = this.props;
    const days = calculateDaysWorked(invoices);
    const tst = (key: string) => `${this.props['data-tst']}-${key}`;

    if (days.daysWorked === 0) {
      return null;
    }

    if (display === 'invoice') {
      return <span data-tst={tst('daysWorked')}>{days.daysWorked.toFixed(1).replace('.', ',')}</span>;
    }

    if (display === 'month') {
      return (
        <span>
          <span data-tst={tst('daysWorked')}>{days.daysWorked.toFixed(1).replace('.', ',')}</span>
          &nbsp;/&nbsp;
          <span data-tst={tst('in-month')}>{days.workDaysInMonth}</span>
          &nbsp;(
          <span data-tst={tst('calc')}>{calcPer(days)}</span>
          )
        </span>
      );
    }

    if (display === 'client') {
      return <span data-tst={tst('daysWorked')}>{t('client.daysWorked', {days: days.daysWorked.toFixed(1).replace('.', ',')})}</span>;
    }

    return null;
  }
}


/**
 * Print % days worked in month
 */
function calcPer(days: DaysWorked & { workDaysInMonth: number }): string {
  return `${Math.round((days.daysWorked / days.workDaysInMonth) * 100)}%`;
}
