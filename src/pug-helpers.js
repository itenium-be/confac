// ES5: Usage from gulpfile

var moment = require('moment');
var numeral = require('numeral');

numeral.language('nl', {
  delimiters: {thousands: '.', decimal: ','},
  currency: {symbol: '€'}
});
numeral.language('nl');

moment.locale('nl');

module.exports = {
  locals: {
    moment: moment,
    numeral: numeral,
    formatDate: dateString => moment(dateString).format('DD/MM/YYYY'),
    numberFormat: number => numeral(number).format('0,0.00'),
  }
};
