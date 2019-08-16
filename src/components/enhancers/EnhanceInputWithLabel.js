import React from 'react';
import {FormGroup, FormLabel} from 'react-bootstrap';

export const EnhanceInputWithLabel = ComposedComponent => ({label, placeholder, ...props}) => {
  if (label) {
    return (
      <FormGroup>
        <FormLabel>{label}</FormLabel>
        <ComposedComponent {...props} placeholder={placeholder || label} />
      </FormGroup>
    );
  }
  return <ComposedComponent {...props} placeholder={placeholder} />;
};
