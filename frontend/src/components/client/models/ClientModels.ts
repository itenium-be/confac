import {InvoiceDateStrategy, IAttachment, Attachment, Language, IAudit, IComment} from '../../../models';
import {EmailModel} from '../../controls/email/EmailModels';
import {InvoiceLine} from '../../invoice/models/InvoiceLineModels';
import {IContractModel} from './ContractModels';



export const ClientTypes = ['partner', 'client', 'endCustomer'] as const;
export type ClientType = typeof ClientTypes[number];


export type ClientModel = IAttachment & {
  _id: string;
  slug: string;
  active: boolean;
  name: string;
  types: ClientType[];
  address: string;
  city: string;
  postalCode: string;
  country: string;
  telephone: string;
  btw: string;
  language: Language;
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
  invoiceFileName: string;
  defaultInvoiceDateStrategy: InvoiceDateStrategy;
  defaultChangingOrderNr: boolean;
  hoursInDay: number;
  defaultInvoiceLines: InvoiceLine[];
  frameworkAgreement: IContractModel;
  audit: IAudit;
};
