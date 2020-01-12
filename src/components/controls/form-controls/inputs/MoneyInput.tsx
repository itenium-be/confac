import React from 'react';
import {BaseInput, BaseInputProps} from './BaseInput';
import {parseIntOrFloat} from './input-util';

type MoneyInputProps = BaseInputProps<number> & {
}

export const MoneyInput = ({value, onChange, ...props}: MoneyInputProps) => (
  <BaseInput
    type="number"
    value={value || ''}
    onChange={(e) => onChange(parseIntOrFloat(e.target.value, true))}
    suffix="€"
    {...props}
  />
);
