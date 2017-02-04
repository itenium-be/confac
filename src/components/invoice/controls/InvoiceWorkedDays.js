import React, {Component, PropTypes} from 'react';
import {t} from '../../util.js';
import {calculateDaysWorked} from '../EditInvoiceViewModel.js';

export class InvoiceWorkedDays extends Component {
  static propTypes = {
    invoices: PropTypes.array.isRequired,
    display: PropTypes.oneOf(['month', 'client']).isRequired,
  }
  static defaultProps = {
    display: 'month'
  }

  render() {
    const {invoices, display} = this.props;
    const days = calculateDaysWorked(invoices);

    if (days.daysWorked === 0) {
      return <div />;
    }

    if (display === 'month') {
      return <span>{days.daysWorked.toFixed(1)} / {days.workDaysInMonth} ({calcPer(days)})</span>;
    }
    if (display === 'client') {
      return <span>{t('client.daysWorked', {days: days.daysWorked.toFixed(1)})}</span>;
    }
  }
}



function calcPer(days) {
  return Math.round(days.daysWorked / days.workDaysInMonth * 100) + '%';
}
