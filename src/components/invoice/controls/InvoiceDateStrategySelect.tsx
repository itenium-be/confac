import React, {Component} from 'react';
import {t} from '../../util';
import {SimpleSelect} from '../../controls/Select';
import {invoiceDateStrategies} from '../invoice-date-strategy';
import { InvoiceDateStrategy } from '../../../models';


type InvoiceDateStrategySelectProps = {
  value: InvoiceDateStrategy,
  onChange: Function,
}

export class InvoiceDateStrategySelect extends Component<InvoiceDateStrategySelectProps> {
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
        placeholder=""
        {...props}
      />
    );
  }
}
