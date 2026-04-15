import moment from 'moment';
import 'moment/locale/nl-be';

// These helper functions are available in the pug templates

moment.locale('nl-be');

const belgianNumberFormatter = new Intl.NumberFormat('nl-BE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default {
  moment,
  formatDate: (dateString: string, format = 'DD/MM/YYYY') => moment(dateString).format(format),
  numberFormat: (number: number) => belgianNumberFormatter.format(number),
};
