import React from "react";
import { Col } from "react-bootstrap";
import { StringInput } from "./StringInput";
import { t } from "../../../utils";

export const StringArrayInput = ({ keys, model, onChange, tPrefix }) => {
  return (
    <>
      {keys.map(key => (
        <Col sm={4} key={key}>
          <StringInput
            label={t(tPrefix + key)}
            value={model[key]}
            onChange={(value: string) => onChange({ ...model, [key]: value })}
            data-tst={tPrefix + key}
          />
        </Col>
      ))}
    </>
  );
};
