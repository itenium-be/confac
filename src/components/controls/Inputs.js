import React from 'react';
import {Col, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import ReactSwitch from 'react-ios-switch';
import {t } from '../util.js';

export const Switch = ({checked, onChange, label, style, ...props}) => (
  <div style={{...style, position: 'relative'}}>
    <ReactSwitch
      checked={checked}
      onChange={onChange}
      {...props}
    />
    <span style={{position: 'absolute', left: 60, bottom: 10}}>{label}</span>
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


export const StringInput = ({label, value, onChange, placeHolder}) => {
  const Input = (
    <FormControl
      type="text"
      value={value}
      placeholder={placeHolder || label}
      onChange={e => onChange(e.target.value)}
    />
  );
  if (label) {
    return <LabeledInput label={label}>{Input}</LabeledInput>;
  }
  return Input;
};

export const StringInputArray = ({keys, model, onChange, tPrefix}) => {
  return (
    <div>
      {keys.map(key => (
        <Col sm={4} key={key}>
          <StringInput
            label={t(tPrefix + key)}
            value={model[key]}
            onChange={value => onChange({...model, [key]: value})}
          />
        </Col>
      ))}
    </div>
  );
};
