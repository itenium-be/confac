import React from 'react';
import {BaseInput, BaseInputProps} from './BaseInput';
import {Icon} from '../../Icon';

type WebsiteInputProps = BaseInputProps<string>;

export const WebsiteInput = ({value, onChange, ...props}: WebsiteInputProps) => (
  <BaseInput
    type="text"
    value={value || ''}
    onChange={(e) => onChange(e.target.value as string)}
    {...props}
    suffix={(
      <a href={value} className="btn input-group-text">
        <Icon fa="fa fa-globe" size={1} />
      </a>
      )}
    suffixOptions={{type: 'button'}}
  />
);
