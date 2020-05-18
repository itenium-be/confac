import {FullFormConfig} from '../../../models';
import {TemplatePicker} from '../../controls/form-controls/select/TemplatePicker';

// configDefinition.addMissingProps = true;

export const configDefinition: FullFormConfig = [
  {title: 'config.company.title'},
  'company.name',
  'company.address',
  'company.city',
  {key: 'company.telephone', component: 'phone'},
  {key: 'company.email', component: 'email'},
  {key: 'company.website', component: 'website'},
  {key: 'company.btw', component: 'btw'},
  'company.rpr',
  {forceRow: true},
  {key: 'company.bank'},
  {key: 'company.iban', component: 'iban'},
  'company.bic',

  {title: 'config.invoiceTitle'},
  {key: 'company.template', component: TemplatePicker},
  {key: 'company.templateQuotation', component: TemplatePicker},
  {key: 'invoicePayDays', component: 'number'},
  {key: 'attachmentTypes', component: 'StringsSelect', cols: 8},
  {key: 'defaultClient', component: 'ClientSelect'},
  {key: 'defaultInvoiceLineType', component: 'InvoiceLineTypeSelect'},
  {key: 'defaultInvoiceDateStrategy', component: 'InvoiceDateStrategySelect'},
  {key: 'invoiceFileName', component: 'InvoiceReplacementsInput', cols: 10},
  {key: 'defaultTax', component: 'float', suffix: '%', cols: 2},

  {title: 'config.email.title'},
  {key: 'email.from', cols: 6, component: 'email'},
  {key: 'email.attachments', component: 'AttachmentsTypeSelect', cols: 6},
  {key: 'email.cc', cols: 6, component: 'email'},
  {key: 'email.bcc', cols: 6, component: 'email'},
  {key: 'email.subject', cols: 12, component: 'InvoiceReplacementsInput'},
  {key: 'email.body', component: 'InvoiceReplacementsTextEditor', cols: 12},
  {key: 'emailSignature', component: 'InvoiceReplacementsTextEditor', cols: 12},
  {key: 'emailReminder', component: 'InvoiceReplacementsTextEditor', cols: 12},
];
