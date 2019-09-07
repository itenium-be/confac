import InvoiceModel from '../components/invoice/models/InvoiceModel';
import { ACTION_TYPES } from '../actions';
import moment from 'moment';

function mapInvoice(invoice: InvoiceModel) {
  invoice.date = moment(invoice.date);
  return invoice;
}

export const invoices = (state: InvoiceModel[] = [], action): InvoiceModel[] => {
  switch (action.type) {
  case ACTION_TYPES.INVOICES_FETCHED:
    // console.log('INVOICES_FETCHED', action.invoices); // eslint-disable-line
    return action.invoices.map(mapInvoice);

  case ACTION_TYPES.INVOICE_DELETED:
    return state.filter(invoice => invoice._id !== action.id);

  case ACTION_TYPES.INVOICE_ADDED:
    return state.concat([mapInvoice(action.invoice)]);

  case ACTION_TYPES.INVOICE_UPDATED: {
    // console.log('UPDATED', action);
    let newState = state.filter(invoice => invoice._id !== action.invoice._id);
    newState.push(mapInvoice(action.invoice));
    return newState;
  }

  case ACTION_TYPES.INVOICE_EMAILED:
    return state.map(invoice => {
      if (invoice._id === action.payload._id) {
        return {
          ...invoice,
          lastEmail: action.payload.lastEmail
        } as InvoiceModel;
      }
      return invoice;
    });

  default:
    return state;
  }
};
