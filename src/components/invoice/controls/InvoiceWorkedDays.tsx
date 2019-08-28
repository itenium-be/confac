import React, {Component} from 'react';
import {t} from '../../util';
import EditInvoiceModel, {calculateDaysWorked, DaysWorked} from '../EditInvoiceModel';

type InvoiceWorkedDaysProps = {
  invoices: EditInvoiceModel[],
  display: 'month' | 'client' | 'invoice',
}

export class InvoiceWorkedDays extends Component<InvoiceWorkedDaysProps> {
  static defaultProps: InvoiceWorkedDaysProps = {
    invoices: [],
    display: 'month'
  }

  render() {
    const {invoices, display} = this.props;
    const days = calculateDaysWorked(invoices);
    const tst = (key: string) => `${this.props['data-tst']}-${key}`;

    if (days.daysWorked === 0) {
      return <div />;
    }

    if (display === 'invoice') {
      return <span data-tst={tst('daysWorked')}>{days.daysWorked.toFixed(1)}</span>;
    }

    if (display === 'month') {
      return (
        <span>
          <span data-tst={tst('daysWorked')}>{days.daysWorked.toFixed(1)}</span>
          &nbsp;/&nbsp;
          <span data-tst={tst('in-month')}>{days.workDaysInMonth}</span>
          &nbsp;(<span data-tst={tst('calc')}>{calcPer(days)}</span>)
        </span>
      );
    }

    if (display === 'client') {
      return <span data-tst={tst('daysWorked')}>{t('client.daysWorked', {days: days.daysWorked.toFixed(1)})}</span>;
    }

    return <div />;
  }
}


/**
 * Print % days worked in month
 */
function calcPer(days: DaysWorked & {workDaysInMonth: number}): string {
  return Math.round(days.daysWorked / days.workDaysInMonth * 100) + '%';
}
