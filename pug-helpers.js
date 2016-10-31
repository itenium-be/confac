import moment from 'moment';
import numeral from 'numeral';

numeral.language('nl', {
  delimiters: {thousands: '.', decimal: ','},
  currency: {symbol: '€'}
});
numeral.language('nl');

export const locals = {
  formatDate: dateString => moment(dateString).format('DD/MM/YYYY'),
  numberFormat: number => numeral(number).format('0,0.00'),
};
