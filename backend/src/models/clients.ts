import {ObjectID} from 'mongodb';
import {IAttachment, IAudit} from './common';

export interface IEmail {
  from?: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  combineAttachments?: boolean;
  attachments: IAttachment[];
}

export interface ISelectItem {
  label: string | number;
  value: string | number;
}

export interface IClientRate {
  type: string;
  hoursInDay: number;
  value: number;
  description: string;
}

export interface IClient {
  _id: ObjectID;
  slug: string;
  active: boolean;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  telephone: string;
  btw: string;
  invoiceFileName: string;
  rate: IClientRate;
  attachments: IAttachment[];
  // extraFields: ISelectItem[];
  // defaultExtraInvoiceFields: ISelectItem[];
  notes: string;
  defaultInvoiceDateStrategy: string;
  email: IEmail;
  audit: IAudit;
}
