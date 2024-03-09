import numeral from 'numeral';
import moment from 'moment';
import latinize from 'latinize';

export const defaultLocale = 'en';

numeral.register('locale', 'nl', {
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

export function moneyFormat(input: any): string {
  return `€ ${numeral(input).format('0,0.00')}`;
}

export function tariffFormat(input: number): string {
  if (input === 0) {
    return '';
  }
  if (input % 1 === 0) {
    return `€ ${numeral(input).format('0,0')}`;
  }
  return `€ ${numeral(input).format('0,0.00')}`;
}

/**
 * Discards all non-numeric characters
 */
export const getNumeric = (text: string) => text.replace(/[^0-9]+/g, '');

export const datePickerDateFormat = 'MM/dd/yyyy';

export const formatDate = (date?: string | Date | moment.Moment, format = 'MM/DD/YYYY'): string => {
  if (!date) {
    return '';
  }
  return moment(date).format(format);
};

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
