import { AppState } from "../models";
import moment from 'moment';
import { ConfigModel } from "../components/config/models/ConfigModel";
import InvoiceModel from "../components/invoice/models/InvoiceModel";
import { ClientModel } from "../components/client/models/ClientModels";
import { EmailModel } from "../components/controls/email/EmailModels";


export type ConfacState = {
  app: AppState,
  config: ConfigModel,
  invoices: InvoiceModel[],
  clients: ClientModel[],
}


export const defaultAppState: AppState = {
  isLoaded: false,
  isBusy: false,
  busyCount: 0,
  invoiceFilters: {
    // search: [{value: moment().year(), label: moment().year(), type: 'year'}],
    search: [{value: 'last 3 months', label: 'last 3 months', type: 'manual_input'}], // See InvoiceListModel
    groupedByMonth: false,
    clientListYears: [moment().year()],
    freeInvoice: '',
    freeClient: '',
  },
};

export function getNewEmail(defaultValues?: EmailModel): EmailModel {
  return Object.assign({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
  }, defaultValues);
}


export const defaultConfig: ConfigModel = {
  company: {
    name: 'Jouw bedrijfsnaam',
    address: 'Streetname 15',
    city: '9000 Brussel',
    btw: '',
    rpr: 'Brussel',
    bank: 'Banknaam',
    iban: 'BE00 0000 0000 0000',
    bic: 'GKCCBEAD',
    telephone: '0000 / 00 00 00',
    email: 'ceo@yahoo.com',
    website: 'www.clicky-me-IT.be'
  },
  defaultClient: null,
  template: 'example-1.pug',
  templateQuotation: 'example-1.pug',
  invoiceFileName: '{date:YYYY-MM} {nr:4} - {clientName}', // ATTN: Duplicated in getNewClient
  defaultTax: 21,
  attachmentTypes: [],
  defaultExtraClientFields: [],
  defaultExtraClientInvoiceFields: [],
  defaultExtraInvoiceFields: [],
  showOrderNr: false,
  groupInvoiceListByMonth: false,
  defaultInvoiceLineType: 'daily',
  defaultInvoiceDateStrategy: 'prev-month-last-day',
  invoicePayDays: 30,
  email: getNewEmail(),
};
