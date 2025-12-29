import {ObjectID} from 'mongodb';
import {IClient} from './clients';
import {IAttachment, IAudit} from './common';
import {EditClientRateType} from './projects';

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
  postalCode: string;
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


export type InvoiceStatus = 'Draft' | 'ToSend' | 'ToPay' | 'Paid';

export interface IInvoice {
  _id: ObjectID;
  number: number;
  client: IClient;
  your: ICompany;
  projectMonth?: InvoiceProjectMonth;
  date: string;
  orderNr: string;
  status: InvoiceStatus;
  fileName: string;
  discount: string;
  attachments: IAttachment[];
  isQuotation: boolean;
  /**
   * Before Peppol, this was the time the email was sent
   * After peppol this is when the invoice was sent to the peppol network
   */
  lastEmail: string;
  _defaultTax: number;
  _defaultType: string;
  // extraFields: ISelectItem[] | IExtraFieldsObject;
  lines: InvoiceLine[];
  money: IInvoiceMoney;
  audit: IAudit;
  creditNotas: string[];
  billit?: IInvoiceBillit;
}

export interface IInvoiceBillit {
  /** The Billit order ID, returned after creating the order in Billit */
  orderId?: number;
}

export const INVOICE_EXCEL_HEADERS = [
  'Number', 'Date', 'Client name', 'Order nr',
  'Without Tax', 'Tax', 'Total', 'Verified', 'Discount',
  'First line desc', 'Id',
];
