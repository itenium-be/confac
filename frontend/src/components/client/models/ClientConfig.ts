import {FullFormConfig} from '../../../models';


export const defaultClientProperties: FullFormConfig = [
  {title: {title: 'client.frameworkAgreement.title', level: 3}, label: ''},
  {key: 'frameworkAgreement', component: 'ContractStatusWithNotes', label: ''},

  {title: 'client.contact'},
  {key: 'name'},
  {key: 'btw', component: 'btw'},
  {key: 'types', component: 'ClientTypeSelect'},

  {key: 'address', cols: 3},
  {key: 'postalCode', cols: 3},
  {key: 'city', cols: 3},
  {key: 'country', component: 'CountrySelect', cols: 3},

  {key: 'contact', suffix: 'user', cols: 3},
  {key: 'contactEmail', component: 'email', cols: 3},
  {key: 'telephone', component: 'phone', cols: 3},
  {key: 'language', component: 'LanguageSelect', cols: 3},

  {key: 'slug', updateOnly: true},
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
  {key: 'btw'},

  {key: 'types', component: 'ClientTypeSelect', cols: 8},
  {key: 'country', component: 'CountrySelect'},

  {key: 'address'},
  {key: 'postalCode'},
  {key: 'city'},

  {key: 'contact', suffix: 'user'},
  {key: 'contactEmail', component: 'email'},
  {key: 'telephone'},
  {key: 'notes', component: 'TextEditor', cols: 12, style: {height: 120}},
];
