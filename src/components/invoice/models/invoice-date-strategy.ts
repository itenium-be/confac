import moment from 'moment';
import {ClientModel} from '../../client/models/ClientModels';
import {ConfigModel} from '../../config/models/ConfigModel';

export const invoiceDateStrategies = ['prev-month-last-day', 'today'];


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



export const getInvoiceDate = (client?: ClientModel, config?: ConfigModel): moment.Moment => {
  const strategy = (client && client.defaultInvoiceDateStrategy) || (config && config.defaultInvoiceDateStrategy);

  switch (strategy) {
    case 'prev-month-last-day':
      return endOfMonth();
    case 'today':
    default:
      return today();
  }
};
