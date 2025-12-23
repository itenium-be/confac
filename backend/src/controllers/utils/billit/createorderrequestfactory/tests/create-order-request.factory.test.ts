import moment from 'moment';
import {fromInvoice} from '../create-order-request.factory';
import {CreateOrderRequest} from '../../../../../services/billit';
import {IInvoice} from '../../../../../models/invoices';
import {someInvoice} from './invoice.fixture';
import {someInvoiceLine} from './invoice-line.fixture';

describe('fromInvoiceAndClient', () => {
  it('should create CreateOrderRequest for invoice with full client data', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      number: 2024001,
      date: '2024-12-23T00:00:00.000Z',
      isQuotation: false,
      client: {
        ...someInvoice.client,
        name: 'Test Company BV',
        address: 'Main Street 5',
        city: 'Brussels',
        postalCode: '1000',
        country: 'BE',
        btw: 'BE 0123.456.789',
      },
      orderNr: 'PO-2024-001',
      lines: [
        {
          ...someInvoiceLine,
          desc: 'Consulting Services',
          amount: 10,
          price: 100,
          tax: 21,
          sort: 0,
        },
        {
          ...someInvoiceLine,
          desc: 'Development Work',
          amount: 5,
          price: 150,
          tax: 21,
          sort: 1,
        },
      ],
    };

    const expected: CreateOrderRequest = {
      OrderType: 'Invoice',
      OrderDirection: 'Income',
      OrderNumber: '2024001',
      OrderDate: '2024-12-23',
      ExpiryDate: moment().add(14, 'days').format('YYYY-MM-DD'),
      Reference: 'PO-2024-001',
      Currency: 'EUR',
      PaymentReference: '+++000/2024/00196+++',
      Customer: {
        Name: 'Test Company BV',
        VATNumber: 'BE0123456789',
        PartyType: 'Customer',
        Addresses: [
          {
            AddressType: 'InvoiceAddress',
            Name: 'Test Company BV',
            Street: 'Main Street 5',
            City: 'Brussels',
            Zipcode: '1000',
            CountryCode: 'BE',
          },
        ],
      },
      OrderLines: [
        {
          Quantity: 10,
          UnitPriceExcl: 100,
          Description: 'Consulting Services',
          VATPercentage: 21,
        },
        {
          Quantity: 5,
          UnitPriceExcl: 150,
          Description: 'Development Work',
          VATPercentage: 21,
        },
      ],
    };

    const actual: CreateOrderRequest = fromInvoice(invoice);

    expect(actual).toEqual(expected);
  });
});
