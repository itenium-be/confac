import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {t} from '../../util';
import {SimpleSelect} from '../../controls/Select';
import {invoiceDateStrategies} from '../invoice-date-strategy';


export class InvoiceDateStrategySelect extends Component {
  static propTypes = {
    value: PropTypes.oneOf(invoiceDateStrategies).isRequired,
    onChange: PropTypes.func.isRequired,
  }
  static defaultProps = {value: 'prev-month-last-day'}

  render() {
    const {value, ...props} = this.props;
    return (
      <SimpleSelect
        label={t('config.defaultInvoiceDateStrategy')}
        transFn={key => t('invoice.dateStrategies.' + key)}
        value={value}
        options={invoiceDateStrategies}
        isClearable={false}
        {...props}
      />
    );
  }
}
