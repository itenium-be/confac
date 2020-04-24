import React from 'react';
import {BaseInput, BaseInputProps} from './BaseInput';
import {Icon} from '../../Icon';

type WebsiteInputProps = BaseInputProps<string>;

const addProtocol = (url: string): string => {
  if (!url.startsWith('http')) {
    return `https://${url}`;
  }
  return url;
};


export const WebsiteInput = ({value, onChange, ...props}: WebsiteInputProps) => (
  <BaseInput
    type="text"
    value={value || ''}
    onChange={e => onChange(e.target.value as string)}
    {...props}
    suffix={(
      <a href={addProtocol(value)} className="btn input-group-text" target="_blank" rel="noopener noreferrer">
        <Icon fa="fa fa-globe" size={1} />
      </a>
      )}
    suffixOptions={{type: 'button'}}
  />
);
