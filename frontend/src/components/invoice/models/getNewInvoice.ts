/* eslint-disable no-param-reassign */
import InvoiceModel from './InvoiceModel';
import {ConfigModel} from '../../config/models/ConfigModel';
import {ClientModel} from '../../client/models/ClientModels';
import {today} from './invoice-date-strategy';


export type NewInvoiceType = Partial<Omit<InvoiceModel, '_id'>> & {
  isQuotation: boolean;
};


export const getNewInvoice = (
  config: ConfigModel,
  invoices: InvoiceModel[],
  clients: ClientModel[],
  invoice: NewInvoiceType,
): InvoiceModel => {

  if (invoice instanceof InvoiceModel) {
    throw Error();
  }


  // CLIENT
  if (!invoice.client && config.defaultClient) {
    invoice.client = clients.find(c => c._id === config.defaultClient);
  }


  // NUMBER
  const invoicesOrQuotations = invoice.isQuotation ? invoices.filter(x => x.isQuotation) : invoices.filter(x => !x.isQuotation);
  invoice.number = invoicesOrQuotations.map(i => i.number).reduce((a, b) => Math.max(a, b), 0) + 1;


  const model = new InvoiceModel(config, invoice);
  if (invoice.client) {
    // DATE: Set in the setClient()
    model.setClient(invoice.client);

    // ... and overwrites "lines"
    if (invoice.lines) {
      model.setLines(invoice.lines);
    }

    if (!model.date) {
      model.date = today();

    } else if (invoicesOrQuotations.length) {
      // Automatically default to today if an invoice
      // for a later date already exists
      const lastDate = invoicesOrQuotations
        .map(i => i.date)
        .sort((a, b) => (a.isBefore(b) ? 1 : -1));

      if (model.date.isBefore(lastDate[0])) {
        model.date = today();
      }
    }
  }
  return model;
};
