import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export const LabeledInput = ({label, children}) => (
  <FormGroup>
    <ControlLabel>{label}</ControlLabel>
    {children}
  </FormGroup>
);

function parseIntOrFloat(str, asFloat) {
  if (!str) {
    return '';
  }
  if (asFloat) {
    return parseFloat(str, 10);
  }
  return parseInt(str, 10);
}

export const NumericInput = ({label, value, onChange, float = false}) => (
  <LabeledInput label={label}>
    <FormControl
      type="number"
      value={value}
      placeholder={label}
      onChange={e => onChange(parseIntOrFloat(e.target.value, float))}
    />
  </LabeledInput>
);
