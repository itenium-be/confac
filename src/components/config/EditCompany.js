import React from 'react';
import {t} from '../util.js';

import {StringInputArray} from '../controls.js';
import {Row} from 'react-bootstrap';

export const EditCompany = ({company, onChange}) => {
  if (!company) {
    return null;
  }

  var keys = ['name', 'address', 'city', 'telephone', 'email', 'website', 'btw', 'iban', 'bic', 'template'];
  keys = keys.concat(Object.keys(company).filter(k => !keys.includes(k)));

  return (
    <Row>
      <h3>{t('config.company.title')}</h3>
      <StringInputArray
        keys={keys}
        model={company}
        onChange={onChange}
        tPrefix="config.company."
      />
    </Row>
  );
};
