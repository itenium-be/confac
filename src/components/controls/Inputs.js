import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import ReactSwitch from 'react-ios-switch';

export const Switch = ({checked, onChange, label, style}) => (
  <div style={style}>
    <ReactSwitch
      checked={checked}
      onChange={onChange}
    />
    <span style={{position: 'absolute', left: 75, bottom: 8}}>{label}</span>
  </div>
);


export const LabeledInput = ({label, children}) => (
  <FormGroup>
    <ControlLabel>{label}</ControlLabel>
    {children}
  </FormGroup>
);

function parseIntOrFloat(str, asFloat) {
  if (!str) {
    return 0;
  }
  if (asFloat) {
    return parseFloat(str, 10);
  }
  return parseInt(str, 10);
}


export const NumericInput = ({label, value, onChange, float = false}) => {
  const Input = (
    <FormControl
      type="number"
      value={value || ''}
      placeholder={label}
      onChange={e => onChange(parseIntOrFloat(e.target.value, float))}
    />
  );
  if (label) {
    return <LabeledInput label={label}>{Input}</LabeledInput>;
  }
  return Input;
};


export const StringInput = ({label, value, onChange}) => {
  const Input = (
    <FormControl
      type="text"
      value={value}
      placeholder={label}
      onChange={e => onChange(e.target.value)}
    />
  );
  if (label) {
    return <LabeledInput label={label}>{Input}</LabeledInput>;
  }
  return Input;
};
