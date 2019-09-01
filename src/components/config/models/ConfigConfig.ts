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
  {key: 'telephone', component: 'phone'},
  {key: 'email', component: 'email'},
  {key: 'website', component: 'website'},
  {key: 'btw', component: 'btw'},
  {forceRow: true},
  {key: 'bank'},
  {key: 'iban', component: 'iban'},
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
