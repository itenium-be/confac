import React from 'react';
import {FormGroup, Form, Col, Row} from 'react-bootstrap';

export type EnhanceInputWithLabelProps = {
  label?: string,
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
          <Form.Label column sm="2">{label}</Form.Label>
          <Col sm="10">
            <ComposedComponent {...props as P} placeholder={placeholder || label} />
          </Col>
        </FormGroup>
      );
    }

    return (
      <FormGroup>
        <Form.Label>{label}</Form.Label>
        <ComposedComponent {...props as P} placeholder={placeholder || label} />
      </FormGroup>
    );
  }

  return <ComposedComponent {...props as P} placeholder={placeholder} />;
};
