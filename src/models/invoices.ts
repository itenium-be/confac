import mongoose from 'mongoose';

import {IClient, ISelectItem} from './clients';
import schemas, {IEmailAttachment} from './common';

export interface IInvoiceMoney {
  totalWithoutTax: number;
  totalTax: number;
  discount?: number | string;
  total: number;
  totals: {
    daily?: number;
    hourly?: number;
  };
}

export interface InvoiceLine {
  desc: string;
  amount: number;
  type: string;
  price: number;
  tax: number;
  sort: number;
  notes?: string;
}

export interface ICompany {
  name: string;
  address: string;
  city: string;
  btw: string;
  rpr: string;
  bank: string;
  iban: string;
  bic: string;
  telephone: string;
  email: string;
  website: string;
  templateQuotation?: string;
  template?: string;
}

export interface IExtraFieldsObject {
  [key: string]: number | string;
}

export interface IInvoice {
  _id: string;
  number: number;
  client: IClient;
  your: ICompany;
  projectId?: string;
  consultantId?: string;
  date: string;
  orderNr: string;
  verified: boolean;
  fileName: string;
  discount: string;
  attachments: IEmailAttachment[];
  isQuotation: boolean;
  lastEmail: string;
  _defaultTax: number;
  _defaultType: string;
  extraFields: ISelectItem[] | IExtraFieldsObject;
  createdOn?: string;
  lines: InvoiceLine[];
  money: IInvoiceMoney;
}

export const INVOICE_EXCEL_HEADERS = ['Number', 'Date', 'Client name', 'Order nr', 'Without Tax', 'Tax', 'Total', 'Verified', 'Discount', 'First line desc', 'Id'];

const invoiceSchema = new mongoose.Schema({
  number: Number,
  client: {
    _id: String,
    ...schemas.clientSchema,
  },
  projectId: String,
  consultantId: String,
  your: {
    name: String,
    address: String,
    city: String,
    btw: String,
    rpr: String,
    bank: String,
    iban: String,
    bic: String,
    telephone: String,
    email: String,
    website: String,
  },
  date: String,
  orderNr: String,
  verified: Boolean,
  fileName: String,
  discount: String,
  attachments: [{
    type: {type: String},
    fileName: String,
    fileType: String,
    lastModifiedDate: String,
  }],
  isQuotation: Boolean,
  lastEmail: String,
  _defaultTax: Number,
  _defaultType: String,
  extraFields: [{
    label: String || Number,
    value: String || Number,
  }],
  createdOn: String,
  lines: [{
    desc: String,
    amount: Number,
    type: {type: String},
    price: Number,
    tax: Number,
    sort: Number,
    notes: String,
  }],
  money: {
    totalWithoutTax: Number,
    totalTax: Number,
    discount: Number || String,
    total: Number,
    totals: {
      daily: Number,
      hourly: Number,
    },
  },
});

export const InvoicesCollection = mongoose.model<IInvoice & mongoose.Document>('invoice', invoiceSchema, 'invoices');
