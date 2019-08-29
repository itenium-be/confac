import { FullFormConfig } from '../../../models';


export const defaultClientProperties: FullFormConfig = [
  { key: 'name', },
  { key: 'btw', suffix: 'building' },
  { key: 'slug', updateOnly: true },
  { key: 'address' },
  { key: 'city' },
  { key: 'telephone', suffix: 'phone' },
  { key: 'contact', suffix: 'user' },
  { key: 'contactEmail', suffix: 'email' },
  { key: 'notes', cols: 12, style: {height: 140}},
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
];
