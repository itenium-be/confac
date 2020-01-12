import React from 'react';
import {t} from '../../utils';
import {SimpleSelect} from '../../controls/form-controls/select/SimpleSelect';
import {EditClientRateType} from '../../../models';
import {BaseInputProps} from '../../controls/form-controls/inputs/BaseInput';


export const invoiceLineTypes = ['hourly', 'daily', 'km', 'items', 'section', 'other'];

type InvoiceLineTypeSelectProps = BaseInputProps<EditClientRateType>;

export const InvoiceLineTypeSelect = ({value = 'hourly', label, ...props}: InvoiceLineTypeSelectProps) => (
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
