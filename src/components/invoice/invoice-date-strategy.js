import moment from 'moment';

export const invoiceDateStrategies = ['prev-month-last-day', 'today'];



const endOfMonth = () => {
  const now = moment();
  if (now.date() > 28) {
    return moment();
  }
  return now.subtract(1, 'months').endOf('month');
};



export const getInvoiceDate = (client, config) => {
  switch (client && client.defaultInvoiceDateStrategy || config.defaultInvoiceDateStrategy) {
  case 'prev-month-last-day':
    return endOfMonth();
  case 'today':
  default:
    return moment();
  }
};
