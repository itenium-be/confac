import moment from 'moment';
import numeral from 'numeral';
import 'moment/locale/nl-be';

// These helper functions are available in the pug templates

numeral.register('locale', 'nl-be', {
  delimiters: {
    thousands: '.',
    decimal: ',',
  },
  abbreviations: {
    thousand: 'k',
    million: 'mln',
    billion: 'mld',
    trillion: 'bln',
  },
  ordinal(number) {
    return number === 1 ? 'ste' : 'de';
  },
  currency: {symbol: '€'},
});

numeral.locale('nl-be');

moment.locale('nl-be');

export default {
  moment,
  numeral,
  formatDate: (dateString: string, format = 'DD/MM/YYYY') => moment(dateString).format(format),
  numberFormat: (number: number) => numeral(number).format('0,0.00'),
};
