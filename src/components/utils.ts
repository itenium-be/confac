import numeral from 'numeral';
import moment from 'moment';
import latinize from 'latinize';

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

/**
 * Discards all non-numeric characters
 */
export const getNumeric = text => text.replace(/[^0-9]+/g, '');

export const formatDate = (date, format = "DD-MM-YYYY") => moment(date).format(format)

/**
 * Make a string ready for search
 */
export const searchinize = (str: string): string => {
  if (!str) {
    return '';
  }

  return latinize(str).trim().toLowerCase();
}

export { default as t } from '../trans';

export { default as EditInvoiceViewModel } from './invoice/models/InvoiceModel';
