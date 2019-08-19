import numeral from 'numeral';

numeral.register('locale', 'nl', {
  delimiters: {
    thousands: '.',
    decimal: ','
  },
  abbreviations: {
    thousand: 'k',
    million: 'm',
    billion: 'b',
    trillion: 't'
  },
  ordinal: function (number) {
    return number === 1 ? 'ste' : 'de';
  },
  currency: {
    symbol: '€'
  }
});

numeral.locale('nl');

export function moneyFormat(input) {
  return '€ ' + numeral(input).format('0,0.00');
}

export const getNumeric = text => text.replace(/[^0-9]+/g, '');

export {default as t} from '../trans';

export {default as EditInvoiceViewModel} from './invoice/EditInvoiceModel';
