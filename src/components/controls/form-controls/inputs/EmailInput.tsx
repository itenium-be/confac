import React from 'react';
import {BaseInput, BaseInputProps} from './BaseInput';
import {Icon} from '../../Icon';

type EmailInputProps = BaseInputProps<string>;

export const EmailInput = ({value, onChange, ...props}: EmailInputProps) => (
  <BaseInput
    type="text"
    value={value || ''}
    onChange={e => onChange(e.target.value as string)}
    {...props}
    suffix={(
      <a href={`mailto:${value}`} className="btn input-group-text">
        <Icon fa="fa fa-envelope" size={1} />
      </a>
      )}
    suffixOptions={{type: 'button'}}
  />
);
