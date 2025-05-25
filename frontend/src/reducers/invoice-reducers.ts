import moment from 'moment';
import InvoiceModel from '../components/invoice/models/InvoiceModel';
import {ACTION_TYPES} from '../actions';

function mapInvoice(invoice: InvoiceModel): InvoiceModel {
  // eslint-disable-next-line no-param-reassign
  if (invoice.projectMonth === undefined || invoice.projectMonth === null) {
    delete invoice.projectMonth;
  }
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

    case ACTION_TYPES.MODELS_UPDATED: {
      const toUpdate = action.payload.filter(x => x.type === 'invoice' && !!x.model);
      const removeIds = toUpdate.map(x => x.model._id);
      const newState = state.filter(model => !removeIds.includes(model._id));
      toUpdate.forEach(model => newState.push(mapInvoice(model.model)));
      return newState;
    }

    case ACTION_TYPES.INVOICE_UPDATED: {
    // console.log('UPDATED', action);
      const newState = state.filter(invoice => invoice._id !== action.invoice._id);
      newState.push(mapInvoice(action.invoice));
      return newState;
    }

    default:
      return state;
  }
};
