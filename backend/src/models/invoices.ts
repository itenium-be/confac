import {ObjectID} from 'mongodb';
import {IClient} from './clients';
import {IAttachment, IAudit} from './common';

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

export interface InvoiceProjectMonth {
  projectMonthId: string;
  month: string;

  consultantId: string;
  consultantName: string;
}


export interface IInvoice {
  _id: ObjectID;
  number: number;
  client: IClient;
  your: ICompany;
  projectMonth?: InvoiceProjectMonth;
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
  lines: InvoiceLine[];
  money: IInvoiceMoney;
  audit: IAudit;
}

export const INVOICE_EXCEL_HEADERS = [
  'Number', 'Date', 'Client name', 'Order nr',
  'Without Tax', 'Tax', 'Total', 'Verified', 'Discount',
  'First line desc', 'Id',
];

export const COUNTRY_CODES = [
  { code: 'BE', country: 'België' },
  { code: 'NL', country: 'Nederland' },
  { code: 'FR', country: 'Frankrijk' },
  { code: 'DE', country: 'Duitsland' },
  { code: 'GB', country: 'UK' }
]

export const ENDPOINT_SCHEMES = [
  { country: 'BE', schemeID: '9925' },
  { country: 'NL', schemeID: '9944' },
  { country: 'FR', schemeID: '9957' },
  { country: 'DE', schemeID: '9930' },
  { country: 'GB', schemeID: '9932' }
];

export const UNIT_CODES = [
  { unit: 'daily', code: 'DAY' },
  { unit: 'hourly', code: 'HUR' },
  { unit: 'km', code: 'KMT' },
  { unit: 'items', code: 'NAR' },
  { unit: 'other', code: 'C64' }
];
