import {ClientRow, ClientTypeTag} from '../types';

type BuiltClient = {
  slug: string;
  active: boolean;
  name: string;
  types: ClientTypeTag[];
  street: string;
  streetNr: string;
  streetBox: string;
  postalCode: string;
  city: string;
  country: string;
  language: string;
  telephone: string;
  btw: string;
  contact: string;
  hoursInDay: number;
  invoiceFileName: string;
  defaultInvoiceLines: Array<{
    desc: string;
    price: number;
    amount: number;
    tax: number;
    type: string;
    sort: number;
  }>;
  attachments: unknown[];
  notes: string;
  comments: unknown[];
  defaultInvoiceDateStrategy: string;
  defaultChangingOrderNr: boolean;
  email: {
    to: string;
    subject: string;
    body: string;
    attachments: Array<{type: string; fileName: string; fileType: string}>;
    combineAttachments: boolean;
  };
  frameworkAgreement: {status: string; notes: string};
  peppolEnabled: boolean;
  audit: {createdOn: string; createdBy: string; modifiedOn: string; modifiedBy: string};
};

const priceByType: Record<ClientTypeTag, number> = {
  client: 550,
  partner: 480,
  endCustomer: 0,
};

export function buildClient(row: ClientRow, type: ClientTypeTag): BuiltClient {
  return {
    slug: row.slug,
    active: true,
    name: row.name,
    types: [type],
    street: row.street,
    streetNr: row.streetNr,
    streetBox: row.streetBox ?? '',
    postalCode: row.postalCode,
    city: row.city,
    country: row.country,
    language: row.language,
    telephone: row.telephone,
    btw: row.btw,
    contact: row.contact,
    hoursInDay: 8,
    invoiceFileName: ' {{formatDate date "YYYY-MM"}} {{zero nr 4}} - {{clientName}}',
    defaultInvoiceLines: [{
      desc: 'Consultancy diensten',
      price: priceByType[type],
      amount: 0,
      tax: 21,
      type: 'daily',
      sort: 0,
    }],
    attachments: [],
    notes: '',
    comments: [],
    defaultInvoiceDateStrategy: 'prev-month-last-day',
    defaultChangingOrderNr: false,
    email: {
      to: `${row.slug}@pongit.be`,
      subject: 'New invoice {{nr}}',
      body: '<p>Dear,</p><p>Please find the invoice attached.</p>',
      attachments: [
        {type: 'pdf', fileName: 'invoice.pdf', fileType: 'application/pdf'},
        {type: 'Getekende timesheet', fileName: 'timesheet.pdf', fileType: 'application/pdf'},
      ],
      combineAttachments: false,
    },
    frameworkAgreement: {
      status: row.frameworkAgreementStatus ?? 'BothSigned',
      notes: '',
    },
    peppolEnabled: row.peppolEnabled ?? (row.country === 'BE'),
    audit: {
      createdOn: new Date().toISOString(),
      createdBy: 'faker',
      modifiedOn: '',
      modifiedBy: '',
    },
  };
}
