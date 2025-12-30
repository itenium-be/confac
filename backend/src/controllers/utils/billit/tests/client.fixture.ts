import {ObjectID} from 'mongodb';
import {IClient} from '../../../../models/clients';
import {someAudit as audit} from './audit.fixture';

export const someClient: IClient = {
  _id: new ObjectID('507f1f77bcf86cd799439011'),
  slug: 'test-company',
  active: true,
  name: 'Test Company BV',
  street: 'Main Street',
  streetNr: '5',
  streetBox: '',
  city: 'Brussels',
  postalCode: '1000',
  country: 'BE',
  telephone: '+32 2 123 45 67',
  btw: 'BE0123456789',
  invoiceFileName: 'invoice-{year}-{number}',
  rate: {
    type: 'daily',
    hoursInDay: 8,
    value: 500,
    description: 'Daily rate',
  },
  attachments: [],
  notes: '',
  defaultInvoiceDateStrategy: 'prev-month-last-day',
  email: {
    to: 'client@example.com',
    subject: 'Invoice',
    body: 'Please find attached invoice',
    attachments: [],
  },
  peppolEnabled: false,
  audit,
};
