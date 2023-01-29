import {ConfigModel} from './ConfigModel';
import {Language, IAudit} from '../../../models';
import {InvoiceLineActions} from '../../invoice/models/InvoiceLineModels';

export const defaultCommunicationLanguage = Language.en;

export const defaultConfig: ConfigModel = {
  key: 'conf',
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
  invoiceFileName: '{date:YYYY-MM} {nr:4} - {clientName}',
  defaultInvoiceLines: InvoiceLineActions.addEmptyLine([]),
  attachmentTypes: [],
  defaultInvoiceDateStrategy: 'prev-month-last-day',
  invoicePayDays: 30,
  email: {cc: '', bcc: '', subject: '', body: '', attachments: []},
  emailSignature: '',
  emailReminder: '',
  emailReminderCc: '',
  emailReminderBcc: '',
  emailInvoiceOnly: '',
  language: defaultCommunicationLanguage,
  audit: {} as IAudit,
};
