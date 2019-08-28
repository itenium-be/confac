import React from 'react';
import ReactSwitch from 'react-ios-switch';

type SwitchProps = {
  checked: boolean,
  onChange: (checked: boolean) => void,
  label: string,
  style?: React.CSSProperties,
  onColor?: string,
}

export const Switch = ({checked, onChange, label, style, ...props}: SwitchProps) => (
  <div style={{...style, position: 'relative'}}>
    <ReactSwitch
      checked={checked}
      onChange={onChange}
      className={props['data-tst']}
      {...props}
    />
    <span style={{position: 'absolute', left: 60, bottom: 10, whiteSpace: 'nowrap'}}>{label}</span>
  </div>
);
