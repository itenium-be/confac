import mongoose from 'mongoose';

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
  className?: string;
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
  _id: String,
  slug: String,
  active: Boolean,
  name: String,
  address: String,
  city: String,
  telephone: String,
  btw: String,
  invoiceFileName: String,
  rate: {
    type: {type: String},
    hoursInDay: Number,
    value: Number,
    description: String,
  },
  attachments: [
    {
      type: {type: String},
      fileName: String,
      fileType: String,
      lastModifiedDate: String,
    }],
  extraFields: [{
    label: String || Number,
    value: String || Number,
    className: String,
  }],
  defaultExtraInvoiceFields: [{
    label: String || Number,
    value: String || Number,
    className: String,
  }],
  notes: String,
  defaultInvoiceDateStrategy: String,
  createdOn: String,
  email: {
    from: String,
    to: String,
    cc: String,
    bcc: String,
    subject: String,
    body: String,
    attachments: [String],
  },
});

export const Clients = mongoose.model<IClient>('client', clientSchema, 'clients');