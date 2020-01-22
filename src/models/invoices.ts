import mongoose from 'mongoose';
import moment from 'moment';

import {IClient, IAttachment, ISelectItem} from './clients';
import common from './common';

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

export interface IConfigCompanyModel {
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
}

export interface IInvoice extends mongoose.Document {
  _id: string;
  number: number;
  client: IClient;
  your: IConfigCompanyModel;
  date: moment.Moment;
  orderNr: string;
  verified: boolean;
  fileName: string;
  discount: string;
  attachments: IAttachment[];
  isQuotation: boolean;
  lastEmail: string;
  _defaultTax: number;
  _defaultType: string;
  extraFields: ISelectItem[];
  createdOn: string;
  lines: InvoiceLine[];
  money: IInvoiceMoney;
}

const invoiceSchema = new mongoose.Schema({
  _id: String,
  number: Number,
  client: {
    ...common.clientSchema,
  },
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
  date: Date,
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
    className: String,
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

export const InvoicesCollection = mongoose.model<IInvoice>('invoice', invoiceSchema, 'invoices');