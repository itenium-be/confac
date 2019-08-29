import { AppState } from "../models";
import moment from 'moment';
import { EditConfigModel } from "../components/config/EditConfigModel";
import EditInvoiceModel from "../components/invoice/models/EditInvoiceModel";
import { EditClientModel } from "../components/client/models/ClientModels";


export type ConfacState = {
  app: AppState,
  config: EditConfigModel,
  invoices: EditInvoiceModel[],
  clients: EditClientModel[],
}


export const defaultAppState: AppState = {
  isLoaded: false,
  isBusy: false,
  busyCount: 0,
  invoiceFilters: {
    // search: [{value: moment().year(), label: moment().year(), type: 'year'}],
    search: [{value: 'last 3 months', label: 'last 3 months', type: 'manual_input'}], // See InvoiceListModel
    unverifiedOnly: false,
    groupedByMonth: false,
    clientListYears: [moment().year()],
    freeInvoice: '',
    freeClient: '',
  },
};


export const defaultConfig: EditConfigModel = {
  company: {
    template: 'example-1.pug',
    name: 'Jouw bedrijfsnaam',
    address: 'Streetname 15',
    city: '9000 Brussel',
    btw: '0000.000.000',
    bank: 'Banknaam',
    iban: 'BE00 0000 0000 0000',
    bic: 'GKCCBEAD',
    telephone: '0000 / 00 00 00',
    email: 'ceo@yahoo.com',
    website: 'www.clicky-me-IT.be'
  },
  defaultClient: null,
  defaultTax: 21,
  attachmentTypes: [],
  extraConfigFields: [],
  defaultExtraClientFields: [],
  defaultExtraClientInvoiceFields: [],
  defaultExtraInvoiceFields: [],
  showOrderNr: false,
  groupInvoiceListByMonth: false,
  defaultInvoiceLineType: 'daily',
  defaultInvoiceDateStrategy: 'prev-month-last-day',
};
