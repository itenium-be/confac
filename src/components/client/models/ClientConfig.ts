import { FullFormConfig } from '../../../models';


export const defaultClientProperties: FullFormConfig = [
  { key: 'name', },
  { key: 'btw', component: 'btw' },
  { key: 'slug', updateOnly: true },
  { key: 'address' },
  { key: 'city' },
  { key: 'telephone', component: 'phone' },
  { key: 'contact', suffix: 'user' },
  { key: 'contactEmail', component: 'email' },
  { key: 'notes', component: 'textarea', cols: 12, style: {height: 140}},
];


export const editClientRateConfig: FullFormConfig = [
  {key: 'value', prefix: '€', component: 'money'},
  {key: 'hoursInDay', component: 'number', suffix: 'fa fa-hourglass-half'},
  {key: 'type', component: 'InvoiceLineTypeSelect'},
  {key: 'description'},
  {key: 'defaultInvoiceDateStrategy', component: 'InvoiceDateStrategySelect'},
  // {key: 'defaultExtraInvoiceFields', component: 'PropertiesSelect'}
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
  {key: 'notes', component: 'textarea', cols: 12, style: {height: 120}},
];
