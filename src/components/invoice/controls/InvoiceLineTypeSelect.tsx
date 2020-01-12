import React, {Component} from 'react';
import {t} from '../../utils';
import {SimpleSelect} from '../../controls/form-controls/select/SimpleSelect';
import {EditClientRateType} from '../../../models';
import {BaseInputProps} from '../../controls/form-controls/inputs/BaseInput';


export const invoiceLineTypes = ['hourly', 'daily', 'km', 'items', 'section', 'other'];

type InvoiceLineTypeSelectProps = BaseInputProps<EditClientRateType>;

export class InvoiceLineTypeSelect extends Component<InvoiceLineTypeSelectProps> {
  static defaultProps = {type: 'hourly'}

  render() {
    const {value, label, ...props} = this.props;
    return (
      <SimpleSelect
        transFn={(key: string) => t(`rates.types.${key}`)}
        value={value}
        options={invoiceLineTypes}
        isClearable={false}
        label={label}
        placeholder=""
        {...props}
      />
    );
  }
}
