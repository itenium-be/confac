import {InvoiceDateStrategy, IAttachment, Attachment, Language, IAudit, IComment} from '../../../models';
import {EmailModel} from '../../controls/email/EmailModels';
import {InvoiceLine} from '../../invoice/models/InvoiceLineModels';
import {IContractModel} from './ContractModels';



export const ClientTypes = ['partner', 'client', 'endCustomer'] as const;
export type ClientType = typeof ClientTypes[number];


export type InvoiceClientModel = {
  _id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  language: Language;
  btw: string;
  telephone: string;
  hoursInDay: number;
  invoiceFileName: string;
}


export type ClientModel = InvoiceClientModel & IAttachment & {
  active: boolean;
  types: ClientType[];
  notes: string;
  comments: IComment[];
  /** ex: Invoicing or Timesheet info documents */
  attachments: Attachment[];
  email: EmailModel & {
    /**
     * When emailing combine attachments to a single pdf.
     * ATTN: Only pdf attachments can be merged!
     */
    combineAttachments: boolean;
  };
  defaultInvoiceDateStrategy: InvoiceDateStrategy;
  defaultChangingOrderNr: boolean;
  defaultInvoiceLines: InvoiceLine[];
  frameworkAgreement: IContractModel;
  peppolEnabled?: boolean;
  audit: IAudit;
};
