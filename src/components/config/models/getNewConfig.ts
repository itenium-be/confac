import {ConfigModel} from './ConfigModel';
import {getNewEmail} from '../../controls/email/getNewEmail';

export const defaultConfig: ConfigModel = {
  company: {
    name: '',
    address: '',
    city: '',
    btw: '',
    rpr: '',
    bank: '',
    iban: '',
    bic: '',
    telephone: '',
    email: '',
    website: '',
    template: 'example-1.pug',
    templateQuotation: 'example-1.pug',
  },
  defaultClient: null,
  invoiceFileName: '{date:YYYY-MM} {nr:4} - {clientName}', // ATTN: Duplicated in getNewClient
  defaultTax: 21,
  attachmentTypes: [],
  showOrderNr: false,
  defaultInvoiceLineType: 'daily',
  defaultInvoiceDateStrategy: 'prev-month-last-day',
  invoicePayDays: 30,
  email: getNewEmail(),
  emailSignature: '',
  emailReminder: '',
};
