import moment from 'moment';
import { t } from '../../utils';



export const displayMonthWithYear = (month: moment.Moment) => {
  const formattedMonth = month.format('MMMM').charAt(0).toUpperCase() + month.format('MMMM').substring(1);
  return t('projectMonth.listTitle', { month: formattedMonth, year: month.year() });
};
