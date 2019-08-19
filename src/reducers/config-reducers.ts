import { EditConfigModel } from '../components/config/EditConfigModel';
import { ACTION_TYPES } from '../actions';

// Config is stored on the backend

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


export const config = (state: EditConfigModel = defaultConfig, action): EditConfigModel => {
  switch (action.type) {
  case ACTION_TYPES.CONFIG_FETCHED:
    console.log('CONFIG_FETCHED', action.config); // eslint-disable-line
    return action.config;

  case ACTION_TYPES.CONFIG_UPDATE:
    return action.config;

  default:
    return state;
  }
};
