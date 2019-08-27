import React from 'react';
import {t} from '../util';

import {InputArray} from '../controls';
import {TemplatePicker} from '../controls/TemplatePicker';
import {Row} from 'react-bootstrap';
import { EditConfigCompanyModel } from './EditConfigModel';
import { FormConfig } from '../../models';

type EditCompanyProps = {
  company: EditConfigCompanyModel,
  onChange: Function,
}

export const EditCompany = ({company, onChange}: EditCompanyProps) => {
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
  var config: FormConfig[] = ['name', 'address', 'city', 'telephone', 'email', 'website', 'btw', 'iban', 'bic', templatePicker, templateQuotationsPicker];
  const configKeys: string[] = config.map(x => typeof x === 'string' ? x : x.key);
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
