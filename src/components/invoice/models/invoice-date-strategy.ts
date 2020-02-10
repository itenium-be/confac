import moment from 'moment';
import {ClientModel} from '../../client/models/ClientModels';
import {ConfigModel} from '../../config/models/ConfigModel';

export const invoiceDateStrategies = ['prev-month-last-day', 'today'];


export const today = (): moment.Moment => {
  return moment.utc().startOf('day');
};


const endOfMonth = (): moment.Moment => {
  if (moment().date() > 28) {
    return today();
  }
  return moment.utc().subtract(1, 'months').endOf('month');
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
