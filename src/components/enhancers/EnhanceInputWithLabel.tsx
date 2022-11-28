import React from 'react';
import {Form, Col, Row} from 'react-bootstrap';

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
  if (label) {
    if (inline) {
      return (
        <Form.Group as={Row}>
          <Form.Label column sm="2">{label}</Form.Label>
          <Col sm="10">
            <ComposedComponent {...props as P} placeholder={placeholder || label} />
          </Col>
        </Form.Group>
      );
    }

    return (
      <Form.Group className="form-group">
        <Form.Label>{label}</Form.Label>
        <ComposedComponent {...props as P} placeholder={placeholder || label} />
      </Form.Group>
    );
  }

  return <ComposedComponent {...props as P} placeholder={placeholder} />;
};
