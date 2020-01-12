import React from 'react';
import {FormGroup, FormLabel, Col, Row} from 'react-bootstrap';

export type EnhanceInputWithLabelProps = {
  label?: string | null,
  /**
   * Defaults to the label
   */
  placeholder?: string,
  /**
   * False: Label above input
   * True: Label left of input
   */
  inline?: boolean,
}

// eslint-disable-next-line max-len
export const EnhanceInputWithLabel = <P extends object>(ComposedComponent: React.ComponentType<P>) => ({label, placeholder, inline, ...props}: EnhanceInputWithLabelProps & P) => {
  if (label !== undefined && label !== null) {
    if (inline) {
      return (
        <FormGroup as={Row}>
          <FormLabel column sm="2">{label}</FormLabel>
          <Col sm="10">
            <ComposedComponent {...props as P} placeholder={placeholder || label} />
          </Col>
        </FormGroup>
      );
    }

    return (
      <FormGroup>
        <FormLabel>{label}</FormLabel>
        <ComposedComponent {...props as P} placeholder={placeholder || label} />
      </FormGroup>
    );
  }

  return <ComposedComponent {...props as P} placeholder={placeholder} />;
};
