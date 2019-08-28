import React, {Component} from 'react';
import {t} from '../../util';
import {SimpleSelect} from '../../controls/form-controls/select/SimpleSelect';
import { EditClientRateType } from '../../../models';


export const invoiceLineTypes = ['hourly', 'daily', 'km', 'items', 'section', 'other'];

type InvoiceLineTypeSelectProps = {
  label: string,
  type: EditClientRateType,
  onChange: Function,
}

export class InvoiceLineTypeSelect extends Component<InvoiceLineTypeSelectProps> {
  static defaultProps = {type: 'hourly'}

  render() {
    const {type, label, ...props} = this.props;
    return (
      <SimpleSelect
        transFn={(key: string) => t('rates.types.' + key)}
        value={type}
        options={invoiceLineTypes}
        isClearable={false}
        label={label}
        placeholder=""
        {...props}
      />
    );
  }
}
