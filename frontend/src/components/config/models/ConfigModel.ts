import {InvoiceDateStrategy, Language, IAudit, Attachment} from '../../../models';
import {EmailModel} from '../../controls/email/EmailModels';
import {InvoiceLine} from '../../invoice/models/InvoiceLineModels';


export type ConfigModel = {
  _id?: string;
  key: 'conf';
  company: ConfigCompanyModel;
  defaultClient: string | null;
  attachmentTypes: string[];
  defaultInvoiceLines: InvoiceLine[];
  defaultInvoiceDateStrategy: InvoiceDateStrategy;
  invoicePayDays: number;
  /** The default invoice file name when creating a new client */
  invoiceFileName: string;
  /**
   * Default values for email sending
   * "to" doesn't make sense on config level
   */
  email: Omit<EmailModel, 'to'>;
  /** The signature for all emails */
  emailSignature: string;
  /** Email body for invoice reminder emails */
  emailReminder: string;
  emailReminderCc: string;
  emailReminderBcc: string;
  emailCreditNotaSubject: string;
  emailCreditNotaBody: string;
  /** Email address to email the invoice pdf (without timesheet) */
  emailInvoiceOnly: string;
  /** How many months to load at initialLoad */
  initialMonthLoad: number | null;
  language: Language;
  /** ConditionsAndTerms */
  attachments: Attachment[];
  audit: IAudit;
}

export type ConfigCompanyModel = {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  btw: string;
  rpr: string;
  bank: string;
  iban: string;
  bic: string;
  telephone: string;
  email: string;
  website: string;
  template: string;
  templateQuotation: string;
}
