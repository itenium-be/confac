import React from 'react';
import {t} from '../util.js';

import {InputArray} from '../controls.js';
import {TemplatePicker} from '../controls/TemplatePicker';
import {Row} from 'react-bootstrap';

export const EditCompany = ({company, onChange}) => {
  if (!company) {
    return null;
  }

  const templatePicker = {
    key: 'template',
    component: TemplatePicker,
  };
  const templateQuotationsPicker = {
    key: 'templateQuotation',
    component: TemplatePicker,
  };
  var config = ['name', 'address', 'city', 'telephone', 'email', 'website', 'btw', 'iban', 'bic', templatePicker, templateQuotationsPicker];
  const configKeys = config.map(x => x.key ? x.key : x);
  config = config.concat(Object.keys(company).filter(k => !configKeys.includes(k)));

  return (
    <Row>
      <h1>{t('config.company.title')}</h1>
      <InputArray
        config={config}
        model={company}
        onChange={onChange}
        tPrefix="config.company."
      />
    </Row>
  );
};
