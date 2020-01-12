import numeral from 'numeral';
import moment from 'moment';
import latinize from 'latinize';

export const defaultLocale = 'nl';

numeral.register('locale', defaultLocale, {
  delimiters: {
    thousands: '.',
    decimal: ',',
  },
  abbreviations: {
    thousand: 'k',
    million: 'm',
    billion: 'b',
    trillion: 't',
  },
  ordinal(number) {
    return number === 1 ? 'ste' : 'de';
  },
  currency: {
    symbol: '€',
  },
});

numeral.locale(defaultLocale);

export function moneyFormat(input): string {
  return `€ ${numeral(input).format('0,0.00')}`;
}

/**
 * Discards all non-numeric characters
 */
export const getNumeric = (text) => text.replace(/[^0-9]+/g, '');

export const datePickerDateFormat = 'dd/MM/yyyy';

export const formatDate = (date: string | Date | moment.Moment, format = 'DD/MM/YYYY'): string => moment(date).format(format);

/**
 * Make a string ready for search
 */
export const searchinize = (str: string): string => {
  if (!str) {
    return '';
  }

  return latinize(str).trim().toLowerCase();
};

export {default as t} from '../trans';

export {default as EditInvoiceViewModel} from './invoice/models/InvoiceModel';
