import moment from 'moment';
import {ClientModel} from '../../client/models/ClientModels';
import {ConfigModel} from '../../config/models/ConfigModel';

export const invoiceDateStrategies = ['new-month-from-22th', 'prev-month-last-day', 'today'];


export const today = (): moment.Moment => moment().startOf('day');


const endOfMonth = (): moment.Moment => {
  if (moment().date() > 28) {
    return today();
  }

  // ATTN: The following returns something like: "Thu Apr 30 2020 23:59:59 GMT+0200"
  // (which should probably be cleaned up at some point)
  const lastDayPrevMonth = moment().subtract(1, 'months').endOf('month');
  return lastDayPrevMonth;
};

const newMonthFromThe22th = (date?: moment.Moment): moment.Moment => {
  const dateToCheck:moment.Moment = date || moment();
  const endOfMonthStartDay:number = 1;
  const endOfMonthEndDay:number = 21;
  const currentDay:number = dateToCheck.date();

  //checking on format to skip any time inequality
  if (dateToCheck.format('YYYY-MM-DD') === dateToCheck.endOf('month').format('YYYY-MM-DD')) {
    return dateToCheck
  } else if (currentDay >= endOfMonthStartDay && currentDay <= endOfMonthEndDay) {
    return dateToCheck.subtract(1, 'months').endOf('month');
  } else {
    return dateToCheck.startOf('month')
  }
};

export const getInvoiceDate = (client?: ClientModel, config?: ConfigModel, date?: moment.Moment): moment.Moment => {
  const strategy = (client && client.defaultInvoiceDateStrategy) || (config && config.defaultInvoiceDateStrategy);

  switch (strategy) {
    case 'prev-month-last-day':
      return endOfMonth();
    case 'new-month-from-22th':
      return newMonthFromThe22th(date)
    case 'today':
    default:
      return today();
  }
};
