import {ObjectID} from 'mongodb';
import {IInvoice} from '../../../../../models/invoices';
import {someClient as client} from '../../tests/client.fixture';
import {someAudit as audit} from '../../tests/audit.fixture';

export const someInvoice: IInvoice = {
  _id: new ObjectID('507f1f77bcf86cd799439012'),
  number: 2024001,
  date: '2024-12-23T00:00:00.000Z',
  isQuotation: false,
  client,
  your: {
    name: 'My Company',
    address: 'Business Street',
    city: 'Ghent',
    postalCode: '9000',
    btw: 'BE0987654321',
    rpr: 'RPR123',
    bank: 'Bank Name',
    iban: 'BE68539007547034',
    bic: 'BICCODE',
    telephone: '+32 9 876 54 32',
    email: 'info@mycompany.be',
    website: 'www.mycompany.be',
  },
  orderNr: 'PO-2024-001',
  status: 'Paid',
  fileName: 'invoice-2024-001.pdf',
  discount: '0',
  attachments: [],
  lastEmail: '',
  _defaultTax: 21,
  _defaultType: 'daily',
  lines: [
    {
      desc: 'Consulting Services',
      amount: 10,
      type: 'daily',
      price: 100,
      tax: 21,
      sort: 0,
    },
    {
      desc: 'Development Work',
      amount: 5,
      type: 'daily',
      price: 150,
      tax: 21,
      sort: 1,
    },
  ],
  money: {
    totalWithoutTax: 1750,
    totalTax: 367.5,
    total: 2117.5,
    totals: {daily: 1750},
  },
  audit,
  creditNotas: [],
  paymentReference: '+++000/2024/00196+++',
};
