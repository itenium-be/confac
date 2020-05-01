import {ObjectID} from 'mongodb';

import {IClient} from './clients';
import {IAttachment} from './common';

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

export interface IInvoice {
  _id: ObjectID;
  number: number;
  client: IClient;
  your: ICompany;
  projectMonthId?: ObjectID;
  consultantId?: string;
  date: string;
  orderNr: string;
  verified: boolean;
  fileName: string;
  discount: string;
  attachments: IAttachment[];
  isQuotation: boolean;
  lastEmail: string;
  _defaultTax: number;
  _defaultType: string;
  // extraFields: ISelectItem[] | IExtraFieldsObject;
  createdOn?: string;
  lines: InvoiceLine[];
  money: IInvoiceMoney;
}

export const INVOICE_EXCEL_HEADERS = [
  'Number', 'Date', 'Client name', 'Order nr',
  'Without Tax', 'Tax', 'Total', 'Verified', 'Discount',
  'First line desc', 'Id',
];
