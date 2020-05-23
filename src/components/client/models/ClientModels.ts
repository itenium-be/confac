import {InvoiceDateStrategy, IAttachment, Attachment, Language, IAudit} from '../../../models';
import {EmailModel} from '../../controls/email/EmailModels';
import {InvoiceLine} from '../../invoice/models/InvoiceLineModels';

export type ClientModel = IAttachment & {
  _id: string,
  slug: string,
  active: boolean,
  name: string,
  address: string,
  city: string,
  telephone: string,
  btw: string,
  language: Language,
  notes: string,
  /** ex: Invoicing or Timesheet info documents */
  attachments: Attachment[],
  email: EmailModel & {
    /**
     * When emailing combine attachments to a single pdf.
     * ATTN: Only pdf attachments can be merged!
     */
    combineAttachments: boolean
  },
  invoiceFileName: string,
  defaultInvoiceDateStrategy: InvoiceDateStrategy,
  defaultChangingOrderNr: boolean,
  hoursInDay: number,
  defaultInvoiceLines: InvoiceLine[],

  audit: IAudit,
}
