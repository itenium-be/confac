import React from 'react';
import {t} from '../../utils';
import {SimpleSelect} from '../../controls/form-controls/select/SimpleSelect';
import {EditClientRateType, EditProjectRateType} from '../../../models';
import {BaseInputProps} from '../../controls/form-controls/inputs/BaseInput';

export const projectLineTypes = ['hourly', 'daily'];

export const invoiceLineTypes = [...projectLineTypes, 'km', 'items', 'section', 'other'];

export type TimesheetTimeConfig = {
  amount: number | undefined;
  rateType: EditProjectRateType;
  hoursInDay: number;
}


/** Turn Daily/Hourly into days */
export function getAmountInDays({amount, rateType, hoursInDay}: TimesheetTimeConfig): number {
  if (!amount) {
    return 0;
  }

  if (rateType === 'hourly') {
    return amount / hoursInDay;
  }

  return amount;
}


export const InvoiceLineTypeSelect = ({value = 'daily', label, ...props}: BaseInputProps<EditClientRateType>) => (
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



export const ProjectLineTypeSelect = ({value = 'daily', label, ...props}: BaseInputProps<EditProjectRateType>) => (
  <SimpleSelect
    transFn={(key: string) => t(`rates.types.${key}`)}
    value={value}
    options={projectLineTypes}
    isClearable={false}
    label={label}
    placeholder=""
    {...props}
  />
);
