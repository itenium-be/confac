import moment from 'moment';
import {ClientModel} from '../../client/models/ClientModels';
import {ConfigModel} from '../../config/models/ConfigModel';

export const invoiceDateStrategies = ['prev-month-last-day', 'today'];


export const today = (): moment.Moment => moment().startOf('day');


const endOfMonth = (date?: moment.Moment): moment.Moment => {
  const dateToCheck:moment.Moment = date || moment();
  const endOfMonthStartDay:number = 1;
  const endOfMonthEndDay:number = 21;
  const currentDay:number = dateToCheck.date();

  //checking on format to skip any time inequality
  if(dateToCheck.format('YYYY-MM-DD') === dateToCheck.endOf('month').format('YYYY-MM-DD')){
    return dateToCheck
  }else if(currentDay >= endOfMonthStartDay && currentDay <= endOfMonthEndDay){
    return dateToCheck.subtract(1, 'months').endOf('month');
  }else{
    return dateToCheck.startOf('month')
  }
};



export const getInvoiceDate = (client?: ClientModel, config?: ConfigModel, date?: moment.Moment): moment.Moment => {
  const strategy = (client && client.defaultInvoiceDateStrategy) || (config && config.defaultInvoiceDateStrategy);

  switch (strategy) {
    case 'prev-month-last-day':
      return endOfMonth(date);
    case 'today':
    default:
      return today();
  }
};
