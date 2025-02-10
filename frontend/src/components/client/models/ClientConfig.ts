import {FullFormConfig} from '../../../models';


export const defaultClientProperties: FullFormConfig = [
  {title: {title: 'client.frameworkAgreement.title', level: 3}, label: ''},
  {key: 'frameworkAgreement', component: 'ContractStatusWithNotes', label: ''},

  {title: 'client.contact'},
  {key: 'name'},
  {key: 'type', component: 'ClientTypeSelect'},
  {key: 'btw', component: 'btw'},
  {key: 'slug', updateOnly: true},
  {key: 'address'},
  {key: 'city'},
  {key: 'postalCode'},
  {key: 'country', component: 'CountrySelect'},
  {key: 'telephone', component: 'phone'},
  {key: 'contact', suffix: 'user'},
  {key: 'contactEmail', component: 'email'},
  {key: 'language', component: 'LanguageSelect'},
  {key: 'notes', component: 'TextEditor', cols: 12, style: {height: 140}},

  {title: 'client.title'},
  {forceRow: true},
  {key: 'defaultInvoiceDateStrategy', component: 'InvoiceDateStrategySelect'},
  {key: 'invoiceFileName', component: 'InvoiceReplacementsInput', cols: 8},
  {key: 'hoursInDay', component: 'number', suffix: 'fa fa-hourglass-half'},
  {key: 'defaultChangingOrderNr', component: 'switch'},

  {title: {title: 'config.defaultInvoiceLines', level: 4}},
  {key: 'defaultInvoiceLines', component: 'EditInvoiceLines', cols: 12, props: {allowEmpty: true}},

  {title: 'config.email.title'},
  {key: 'email.to', component: 'email', cols: 6},
  {key: 'email.attachments', component: 'AttachmentsTypeSelect', cols: 6},
  {key: 'email.cc', component: 'email', cols: 6},
  {key: 'email.bcc', component: 'email', cols: 6},
  {key: 'email.subject', component: 'InvoiceReplacementsInput', cols: 12},
  {key: 'email.body', component: 'InvoiceReplacementsTextEditor', cols: 12, label: ''},
  {key: 'email.combineAttachments', component: 'bool'},
];



/**
 * Config used by the ClientModal
 */
export const requiredClientProperties: FullFormConfig = [
  {key: 'name', cols: 8},
  {key: 'type', component: 'ClientTypeSelect'},
  {key: 'btw'},
  {key: 'address'},
  {key: 'city'},
  {key: 'telephone'},
  {forceRow: true},
  {key: 'contact', cols: 6},
  {key: 'contactEmail', component: 'email', cols: 6},
  {key: 'notes', component: 'TextEditor', cols: 12, style: {height: 120}},
];
