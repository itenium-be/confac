import mongoose from 'mongoose';

import common from './common';

export interface IAttachment {
  type: string;
  fileName: string;
  fileType: string;
  lastModifiedDate: string;
}

export interface IEmail {
  from?: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  attachments: string[];
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

export interface IClient extends mongoose.Document {
  _id: string;
  slug: string;
  active: boolean;
  name: string;
  address: string;
  city: string;
  telephone: string;
  btw: string;
  invoiceFileName: string;
  rate: IClientRate;
  attachments: IAttachment[];
  extraFields: ISelectItem[];
  defaultExtraInvoiceFields: ISelectItem[];
  notes: string;
  defaultInvoiceDateStrategy: string;
  createdOn: string;
  email: IEmail;
}

const clientSchema = new mongoose.Schema({
  ...common.clientSchema,
});

export const ClientsCollection = mongoose.model<IClient>('client', clientSchema, 'clients');