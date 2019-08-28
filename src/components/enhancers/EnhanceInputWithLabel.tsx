import React from 'react';
import {FormGroup, FormLabel} from 'react-bootstrap';


export const EnhanceInputWithLabel = <P extends object>(ComposedComponent: React.ComponentType<P>) =>
  ({label, placeholder, ...props}: {label?: string, placeholder?: string} & P) => {
    if (label) {
      return (
        <FormGroup>
          <FormLabel>{label}</FormLabel>
          <ComposedComponent {...props as P} placeholder={placeholder || label} />
        </FormGroup>
      );
    }
    return <ComposedComponent {...props as P} placeholder={placeholder} />;
  };
