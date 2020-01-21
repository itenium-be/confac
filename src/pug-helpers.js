// ES5: Usage from gulpfile

const moment = require('moment');
const numeral = require('numeral');

numeral.language('nl', {
  delimiters: {thousands: '.', decimal: ','},
  currency: {symbol: '€'},
});
numeral.language('nl');

require('moment/locale/nl-be');

moment.locale('nl-be');

module.exports = {
  locals: {
    moment,
    numeral,
    formatDate: dateString => moment(dateString).format('DD/MM/YYYY'),
    numberFormat: number => numeral(number).format('0,0.00'),
  },
};
