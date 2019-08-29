import React from 'react';
import {t} from '../util';
import {ArrayInput} from '../controls';
import {TemplatePicker} from '../controls/form-controls/select/TemplatePicker';
import {Row} from 'react-bootstrap';
import { EditConfigCompanyModel } from './EditConfigModel';
import { AnyFormConfig } from '../../models';
import { normalizeFormConfig } from '../controls/form-controls/lib/form-controls-util';

type EditCompanyProps = {
  company: EditConfigCompanyModel,
  onChange: (value: any) => void,
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

  const configDefinition: AnyFormConfig[] = [
    'name',
    'address',
    'city',
    {key: 'telephone', suffix: 'phone'},
    {key: 'email', suffix: 'email'},
    {key: 'website', suffix: 'website'},
    'btw',
    {forceRow: true},
    {key: 'bank', prefix: 'building'},
    {key: 'iban', suffix: 'bank'},
    'bic',
    templatePicker,
    templateQuotationsPicker
  ];
  const config = normalizeFormConfig(configDefinition, company);

  return (
    <Row>
      <h1>{t('config.company.title')}</h1>
      <ArrayInput
        config={config}
        model={company}
        onChange={onChange}
        tPrefix="config.company."
      />
    </Row>
  );
};
