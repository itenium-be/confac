import React from 'react';
import {MinimalInputProps} from './BaseInput';

export type CheckboxInputProps = MinimalInputProps<boolean> & {
  style?: React.CSSProperties,
  label: string,
}

export const CheckboxInput = ({value, label, onChange, ...props}: CheckboxInputProps) => {
  return (
    <div style={{marginBottom: 5}}>
      <input
        type="checkbox"
        checked={value || false}
        onChange={evt => onChange(evt.target.checked)}
        {...props}
      />
      <span style={{paddingLeft: 10}}>{label}</span>
    </div>
  );
};
