import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {t} from '../../util.js';
import {calculateDaysWorked} from '../EditInvoiceViewModel.js';

export class InvoiceWorkedDays extends Component {
  static propTypes = {
    'data-tst': PropTypes.string.isRequired,
    invoices: PropTypes.array.isRequired,
    display: PropTypes.oneOf(['month', 'client', 'invoice']).isRequired,
  }
  static defaultProps = {
    display: 'month'
  }

  render() {
    const {invoices, display} = this.props;
    const days = calculateDaysWorked(invoices);
    const tst = key => `${this.props['data-tst']}-${key}`;

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



function calcPer(days) {
  return Math.round(days.daysWorked / days.workDaysInMonth * 100) + '%';
}
