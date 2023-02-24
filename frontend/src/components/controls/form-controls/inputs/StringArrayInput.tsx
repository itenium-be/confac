import React from 'react';
import {Col} from 'react-bootstrap';
import {StringInput} from './StringInput';
import {t} from '../../../utils';

type StringArrayInputProps = {
  keys: string[];
  model: any;
  onChange: Function;
  tPrefix: string;
}

export const StringArrayInput = ({keys, model, onChange, tPrefix}: StringArrayInputProps) => (
  <>
    {keys.map(key => (
      <Col sm={4} key={key}>
        <StringInput
          label={t(tPrefix + key)}
          value={model[key]}
          onChange={(value: string) => onChange({...model, [key]: value})}
        />
      </Col>
    ))}
  </>
);
