import React from 'react';
import {FormGroup, ControlLabel} from 'react-bootstrap';

export const EnhanceInputWithLabel = ComposedComponent => ({label, placeholder, ...props}) => {
  if (label) {
    return (
      <FormGroup>
        <ControlLabel>{label}</ControlLabel>
        <ComposedComponent {...props} placeholder={placeholder || label} />
      </FormGroup>
    );
  }
  return <ComposedComponent {...props} placeholder={placeholder} />;
};
