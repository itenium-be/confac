import {ObjectID} from 'mongodb';
import {IEmail} from './clients';
import {IAudit} from './common';


export interface ICompanyConfig {
  _id: ObjectID;
  key: string;
  company: {
    template: string;
    templateQuotation: string;
    name: string;
    address: string;
    city: string;
    postalCode: string;
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
  // defaultExtraClientFields: string[];
  // defaultExtraClientInvoiceFields: string[];
  // showOrderNr: boolean;
  // groupInvoiceListByMonth: boolean;
  defaultInvoiceLineType: string;
  defaultInvoiceDateStrategy: string;
  email: IEmail;
  emailSignature: string;
  emailReminder: string;
  audit: IAudit;
}
