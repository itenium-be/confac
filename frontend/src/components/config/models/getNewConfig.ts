import {ConfigModel} from './ConfigModel';
import {Language, IAudit} from '../../../models';
import {InvoiceLineActions} from '../../invoice/models/InvoiceLineModels';
import moment from 'moment';

export const defaultCommunicationLanguage = Language.en;

export const defaultConfig: ConfigModel = {
  key: 'conf',
  company: {
    name: '',
    address: '',
    city: '',
    postalCode: '',
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
  invoiceFileName: ' {{formatDate date "YYYY-MM-DD"}} {{zero nr 4}} - {{clientName}}',
  defaultInvoiceLines: InvoiceLineActions.addEmptyLine([]),
  attachmentTypes: [],
  defaultInvoiceDateStrategy: 'prev-month-last-day',
  invoicePayDays: 30,
  email: {cc: '', bcc: '', subject: '', body: '', attachments: []},
  emailSignature: '',
  emailReminder: '',
  emailReminderCc: '',
  emailReminderBcc: '',
  emailCreditNotaSubject: '',
  emailCreditNotaBody: '',
  emailInvoiceOnly: '',
  initialMonthLoad: 12,
  peppolPivotDate: moment.utc('2026-01-01'),
  language: defaultCommunicationLanguage,
  attachments: [],
  audit: {} as IAudit,
};
