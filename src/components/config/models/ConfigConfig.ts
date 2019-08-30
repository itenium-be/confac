import { FullFormConfig } from '../../../models';
import { TemplatePicker } from '../../controls/form-controls/select/TemplatePicker';

const templatePicker = {
  key: 'template',
  component: TemplatePicker,
};
const templateQuotationsPicker = {
  key: 'templateQuotation',
  component: TemplatePicker,
};

export const configDefinition: FullFormConfig = [
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
configDefinition.addMissingProps = true;

export const configSettingsDefinition: FullFormConfig = [
  {key: 'showOrderNr', component: 'switch'},
  {key: 'groupByMonth', component: 'switch'},
];


export const configInvoiceDefinition: FullFormConfig = [
  {key: 'defaultClient', component: 'ClientSelect'},
  {key: 'defaultTax', component: 'float', suffix: '%'},
  {key: 'attachmentTypes', component: 'StringsSelect'},
  {key: 'defaultInvoiceLineType', component: 'InvoiceLineTypeSelect'},
  {key: 'defaultInvoiceDateStrategy', component: 'InvoiceDateStrategySelect'},
];
