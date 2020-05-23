import {InvoiceDateStrategy, Language, IAudit} from '../../../models';
import {EmailModel} from '../../controls/email/EmailModels';
import {InvoiceLine} from '../../invoice/models/InvoiceLineModels';


export type ConfigModel = {
  key: 'conf',
  company: ConfigCompanyModel,
  defaultClient: string | null,
  attachmentTypes: string[],
  defaultInvoiceLines: InvoiceLine[],
  defaultInvoiceDateStrategy: InvoiceDateStrategy,
  invoicePayDays: number,
  /** The default invoice file name when creating a new client */
  invoiceFileName: string,
  /**
   * Default values for email sending
   * "to" doesn't make sense on config level
   */
  email: Omit<EmailModel, 'to'>,
  /** The signature for all emails */
  emailSignature: string,
  /** Email body for invoice reminder emails */
  emailReminder: string,
  emailReminderCc: string,
  emailReminderBcc: string,
  language: Language,
  audit: IAudit;
}

export type ConfigCompanyModel = {
  name: string,
  address: string,
  city: string,
  btw: string,
  rpr: string,
  bank: string,
  iban: string,
  bic: string,
  telephone: string,
  email: string,
  website: string,
  template: string,
  templateQuotation: string,
}
