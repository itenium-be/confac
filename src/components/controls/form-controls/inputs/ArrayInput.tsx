import React from "react";
import { StringInput } from "./StringInput";
import { Col } from "react-bootstrap";
import { t } from "../../../util";

export const ArrayInput = ({config, model, onChange, tPrefix}) => {
  config = config.map(x => {
    if (typeof x === 'string') {
      return {key: x};
    }
    return x;
  });

  if (!model._id) {
    config = config.filter(c => !c.updateOnly);
  }

  return (
    <>
      {config.map((col, index) => {
        if (col.forceRow) {
          return <div key={index} style={{clear: 'both'}} />;
        }

        const EditComponent = col.component || StringInput;
        return (
          <Col sm={{span: col.cols || 4, offset: col.offset}} key={col.key || index}>
            <EditComponent
              label={t(tPrefix + col.key)}
              value={model[col.key]}
              onChange={value => onChange({...model, [col.key]: value})}
              data-tst={tPrefix + col.key}
            />
          </Col>
        );
      })}
    </>
  );
};
