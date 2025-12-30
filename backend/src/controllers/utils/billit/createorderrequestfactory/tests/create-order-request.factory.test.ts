import moment from 'moment';
import {fromInvoice} from '../create-order-request.factory';
import {CreateOrderRequest} from '../../../../../services/billit';
import {IInvoice} from '../../../../../models/invoices';
import {someInvoice} from './invoice.fixture';
import {someInvoiceLine} from './invoice-line.fixture';

describe('fromInvoice', () => {
  it('should create CreateOrderRequest for invoice with full client data', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      number: 2024001,
      date: '2024-12-23T00:00:00.000Z',
      isQuotation: false,
      paymentReference: '+++000/2024/00196+++',
      client: {
        ...someInvoice.client,
        name: 'Test Company BV',
        street: 'Main Street',
        streetNr: '5',
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
      ExpiryDate: moment().add(30, 'days').format('YYYY-MM-DD'),
      Reference: 'PO-2024-001',
      OrderTitle: undefined,
      Comments: undefined,
      InternalInfo: undefined,
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
            Street: 'Main Street',
            StreetNumber: '5',
            Box: '',
            City: 'Brussels',
            Zipcode: '1000',
            CountryCode: 'BE',
          },
        ],
        Email: 'to@someone.com',
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

    const client = {...invoice.client, email: {to: 'to@someone.com', subject: '', body: '', attachments: []}};
    const actual: CreateOrderRequest = fromInvoice(invoice, client);

    expect(actual).toEqual(expected);
  });

  it('should set OrderTitle, Comments and InternalInfo from projectMonth', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      number: 2024001,
      date: '2024-12-23T00:00:00.000Z',
      isQuotation: false,
      paymentReference: '+++412/2024/00137+++',
      projectMonth: {
        projectMonthId: 'pm-123',
        month: '2024-12-01T00:00:00.000Z',
        consultantId: 'cons-123',
        consultantName: 'John Doe',
      },
      lines: [someInvoiceLine],
    };

    const client = {...invoice.client, email: {to: 'to@someone.com', subject: '', body: '', attachments: []}};
    const actual: CreateOrderRequest = fromInvoice(invoice, client);

    expect(actual.OrderTitle).toBe('2024-12 - John Doe');
    expect(actual.Comments).toBe('2024-12 - John Doe');
    expect(actual.InternalInfo).toBe('2024-12 - John Doe');
  });

  it('should handle projectMonth with only month (no consultant)', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      number: 2024001,
      date: '2024-12-23T00:00:00.000Z',
      isQuotation: false,
      paymentReference: '+++412/2024/00137+++',
      projectMonth: {
        projectMonthId: 'pm-123',
        month: '2024-12-01T00:00:00.000Z',
        consultantId: '',
        consultantName: '',
      },
      lines: [someInvoiceLine],
    };

    const client = {...invoice.client, email: {to: 'to@someone.com', subject: '', body: '', attachments: []}};
    const actual: CreateOrderRequest = fromInvoice(invoice, client);

    expect(actual.OrderTitle).toBe('2024-12');
    expect(actual.Comments).toBe('2024-12');
    expect(actual.InternalInfo).toBe('2024-12');
  });
});
