import React from 'react';
import ReactSwitch from 'react-ios-switch';

export const Switch = ({checked, onChange, label, style, ...props}) => (
  <div style={{...style, position: 'relative'}}>
    <ReactSwitch
      checked={checked}
      onChange={onChange}
      className={props['data-tst']}
      {...props}
    />
    <span style={{position: 'absolute', left: 60, bottom: 10}}>{label}</span>
  </div>
);
