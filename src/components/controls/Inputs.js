import React from 'react';
import {Col, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import ReactSwitch from 'react-ios-switch';
import {t} from '../util.js';

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


export const StringInput = ({label, value, onChange, placeholder}) => {
  const Input = (
    <FormControl
      type="text"
      value={value}
      placeholder={placeholder || label}
      onChange={e => onChange(e.target.value)}
    />
  );
  if (label) {
    return <LabeledInput label={label}>{Input}</LabeledInput>;
  }
  return Input;
};

export const TextareaInput = ({label, value, onChange, placeholder}) => {
  const Input = (
    <FormControl
      componentClass="textarea"
      value={value}
      placeholder={placeholder || label}
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

export const InputArray = ({config, model, onChange, tPrefix}) => {
  if (!model._id) {
    config = config.filter(c => !c.updateOnly);
  }

  return (
    <div>
      {config.map(col => (
        <Col sm={4} key={col.key}>
          <StringInput
            label={t(tPrefix + col.key)}
            value={model[col.key]}
            onChange={value => onChange({...model, [col.key]: value})}
          />
        </Col>
      ))}
    </div>
  );
};

export const ExtraFieldsInput = ({properties, onChange}) => {
  const updater = (updateLabel, newText) => {
    onChange(properties.map(col => {
      if (col.label === updateLabel) {
        return {
          label: col.label,
          value: newText,
        };
      }
      return col;
    }));
  };

  return (
    <div>
      {properties.map(col => (
        <Col sm={4} key={col.label}>
          <StringInput
            label={col.label}
            value={col.value}
            onChange={updater.bind(this, col.label)}
          />
        </Col>
      ))}
    </div>
  );
};
