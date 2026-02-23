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

export function moneyFormat(input: string | number): string {
  const inputNumber = numeral(input);
  const value = inputNumber.value();

  if (value === null)
    return '€ 0,00';

  if (value < 0) {
    return `€ -${numeral(Math.abs(value)).format('0,0.00')}`;
  }

  return `€ ${inputNumber.format('0,0.00')}`;
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

export const datePickerDateFormat = 'dd/MM/yyyy';

export const formatDate = (date?: string | Date | moment.Moment, format = 'DD/MM/YYYY'): string => {
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

export const sortResult = <T>(sorter: (a: T, b: T) => number, asc: boolean): (a: T, b: T) => number => {
  return (a, b) => asc ? sorter(a, b) : sorter(b, a);
};

export {default as t} from '../trans';
