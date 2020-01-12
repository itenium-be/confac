import React from 'react';
import {BaseInput, BaseInputProps} from './BaseInput';

type StringInputProps = BaseInputProps<string>;

export const StringInput = ({value, onChange, ...props}: StringInputProps) => (
  <BaseInput
    type="text"
    value={value || ''}
    onChange={e => onChange(e.target.value as string)}
    {...props}
  />
);
