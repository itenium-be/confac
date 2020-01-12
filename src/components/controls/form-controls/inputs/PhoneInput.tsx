import React from 'react';
import {BaseInput, BaseInputProps} from './BaseInput';
import {Icon} from '../../Icon';

type PhoneInputProps = BaseInputProps<string>;

export const PhoneInput = ({value, onChange, ...props}: PhoneInputProps) => (
  <BaseInput
    type="text"
    value={value || ''}
    onChange={e => onChange(e.target.value as string)}
    {...props}
    suffix={(
      <a href={`tel:${(value || '').replace(/[^0-9]/g, '')}`} className="btn input-group-text">
        <Icon fa="fa fa-phone" size={1} />
      </a>
      )}
    suffixOptions={{type: 'button'}}
  />
);
