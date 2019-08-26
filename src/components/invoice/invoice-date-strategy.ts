import moment from 'moment';
import { EditClientModel } from '../client/ClientModels';
import { EditConfigModel } from '../config/EditConfigModel';

export const invoiceDateStrategies = ['prev-month-last-day', 'today'];



const endOfMonth = (): moment.Moment => {
  const now = moment();
  if (now.date() > 28) {
    return moment();
  }
  return now.subtract(1, 'months').endOf('month');
};



export const getInvoiceDate = (client: EditClientModel, config?: EditConfigModel): moment.Moment => {
  switch ((client || {}).defaultInvoiceDateStrategy || (config && config.defaultInvoiceDateStrategy)) {
  case 'prev-month-last-day':
    return endOfMonth();
  case 'today':
  default:
    return moment();
  }
};
