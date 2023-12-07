import React from 'react';
import {InputGroup} from 'react-bootstrap';
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
      <InputGroup.Text>
        <a href={`mailto:${value}`} target="_blank" rel="noopener noreferrer">
          <Icon fa="fa fa-envelope" size={1} />
        </a>
      </InputGroup.Text>
    )}
    suffixOptions={{type: 'button'}}
  />
);
