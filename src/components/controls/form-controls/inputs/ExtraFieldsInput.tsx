import React from "react";
import { Col } from "react-bootstrap";
import { StringInput } from "./StringInput";


export const ExtraFieldsInput = ({properties, onChange, ...props}) => {
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
    <>
      {properties.map(col => (
        <Col sm={4} key={col.label}>
          <StringInput
            label={col.label}
            value={col.value}
            onChange={updater.bind(null, col.label)}
            data-tst={props['data-tst'] + '_' + col.label}
          />
        </Col>
      ))}
    </>
  );
};
