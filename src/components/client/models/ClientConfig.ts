import { FullFormConfig } from '../../../models';


export const defaultClientProperties: FullFormConfig = [
  { title: 'client.contact'},
  { key: 'name', },
  { key: 'btw', component: 'btw' },
  { key: 'slug', updateOnly: true },
  { key: 'address' },
  { key: 'city' },
  { key: 'telephone', component: 'phone' },
  { key: 'contact', suffix: 'user' },
  { key: 'contactEmail', component: 'email' },
  { key: 'notes', component: 'TextEditor', cols: 12, style: {height: 140}},

  {title: 'client.title'},
  {key: 'rate.description'},
  {key: 'rate.type', component: 'InvoiceLineTypeSelect'},
  {key: 'rate.value', prefix: '€', component: 'money'},
  {forceRow: true},
  {key: 'defaultInvoiceDateStrategy', component: 'InvoiceDateStrategySelect'},
  {key: 'invoiceFileName', suffix: 'invoice', cols: 8},
  {key: 'rate.hoursInDay', component: 'number', suffix: 'fa fa-hourglass-half'},
  {key: 'defaultExtraInvoiceFields', component: 'PropertiesSelect'},
  {key: 'extraFields', component: 'PropertiesSelect', reactKey: 'extraFields'},
  {key: 'extraFields', component: 'ExtraFields', cols: 12, reactKey: 'extraFieldsImpl'},

  {title: 'config.email.title'},
  {key: 'email.to', cols: 6},
  {key: 'email.attachments', component: 'AttachmentsTypeSelect', cols: 6},
  {key: 'email.cc', cols: 6},
  {key: 'email.bcc', cols: 6},
  {key: 'email.subject', cols: 12},
  {key: 'email.body', component: 'TextEditor', cols: 12, label: ''},
];



/**
 * Config used by the ClientModal
 */
export const requiredClientProperties: FullFormConfig = [
  {key: 'name', cols: 8},
  {key: 'btw'},
  {key: 'address'},
  {key: 'city'},
  {key: 'telephone'},
  {forceRow: true},
  {key: 'contact', cols: 6},
  {key: 'contactEmail', cols: 6, suffix: 'email'},
  {key: 'notes', component: 'TextEditor', cols: 12, style: {height: 120}},
];
