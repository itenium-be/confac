import mongoose from 'mongoose';

import {IEmail} from './clients';
import schemas from './common';

export interface ICompanyConfig {
  _id: string;
  key: string;
  company: {
    template: string;
    name: string;
    address: string;
    city: string;
    btw: string;
    bank: string;
    iban: string;
    bic: string;
    telephone: string;
    email: string;
    website: string;
  };
  defaultClient: string | null;
  defaultTax: number;
  attachmentTypes: string[];
  defaultExtraClientFields: string[];
  defaultExtraClientInvoiceFields: string[];
  showOrderNr: boolean;
  groupInvoiceListByMonth: boolean;
  defaultInvoiceLineType: string;
  defaultInvoiceDateStrategy: string;
  email: IEmail;
  emailSignature: string;
  emailReminder: string;
}

export const DEFAULT_COMPANY_CONFIG = {
  key: 'conf',
  company: {
    template: 'example-1.pug',
    name: 'Jouw bedrijfsnaam',
    address: 'Streetname 15',
    city: '9000 Brussel',
    btw: '0000.000.000',
    bank: 'Banknaam',
    iban: 'BE00 0000 0000 0000',
    bic: 'GKCCBEAD',
    telephone: '0000 / 00 00 00',
    email: 'ceo@yahoo.com',
    website: 'www.clicky-me-IT.be',
  },
  defaultClient: null,
  defaultTax: 21,
  attachmentTypes: ['Getekende timesheet'],
  defaultExtraClientFields: [],
  defaultExtraClientInvoiceFields: [],
  showOrderNr: false,
  groupInvoiceListByMonth: false,
  defaultInvoiceLineType: 'daily',
  defaultInvoiceDateStrategy: 'prev-month-last-day',
  email: {
    to: '',
    cc: '',
    from: '',
    bcc: '',
    subject: '',
    body: '',
    attachments: [],
  },
  emailSignature: '',
  emailReminder: '',
};

const companyConfigSchema = new mongoose.Schema({
  key: String,
  company: {
    template: String,
    name: String,
    address: String,
    city: String,
    btw: String,
    bank: String,
    iban: String,
    bic: String,
    telephone: String,
    email: String,
    website: String,
  },
  defaultClient: String || null,
  defaultTax: Number,
  attachmentTypes: [String],
  defaultExtraClientFields: [String],
  defaultExtraClientInvoiceFields: [String],
  showOrderNr: Boolean,
  groupInvoiceListByMonth: Boolean,
  defaultInvoiceLineType: String,
  defaultInvoiceDateStrategy: String,
  email: schemas.emailSchema,
  emailSignature: String,
  emailReminder: String,
});

export const CompanyConfigCollection = mongoose.model<ICompanyConfig & mongoose.Document>('config', companyConfigSchema, 'config');