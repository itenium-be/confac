import numeral from 'numeral';

export function moneyFormat(input) {
  return '€ ' + numeral(input).format('0,0.00');
}

export { default as t } from '../trans.js';


export { InvoiceModel } from '../models/InvoiceModel.js';
