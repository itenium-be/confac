import moment from 'moment';
import {fromInvoice} from '../create-order-request.factory';
import {CreateOrderRequest} from '../../../../../services/billit';
import {IInvoice} from '../../../../../models/invoices';
import {someInvoice, someClient} from './invoice.fixture';
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
      PeriodFrom: undefined,
      PeriodTill: undefined,
      Reference: 'PO-2024-001',
      OrderTitle: undefined,
      Comments: undefined,
      InternalInfo: undefined,
      Currency: 'EUR',
      PaymentReference: '+++000/2024/00196+++',
      ContractDocumentReference: undefined,
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
        Language: 'NL',
      },
      OrderLines: [
        {
          Quantity: 10,
          UnitPriceExcl: 100,
          Unit: 'DAY',
          Description: 'Consulting Services',
          VATPercentage: 21,
        },
        {
          Quantity: 5,
          UnitPriceExcl: 150,
          Unit: 'DAY',
          Description: 'Development Work',
          VATPercentage: 21,
        },
      ],
    };

    const actual: CreateOrderRequest = fromInvoice(invoice, someClient);

    expect(actual).toEqual(expected);
  });

  it('should set OrderTitle, Comments and InternalInfo from projectMonth', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      projectMonth: {
        projectMonthId: 'pm-123',
        month: '2024-12-01T00:00:00.000Z',
        consultantId: 'cons-123',
        consultantName: 'John Doe',
      },
    };

    const actual: CreateOrderRequest = fromInvoice(invoice, someClient);

    expect(actual.OrderTitle).toBe('2024-12 - John Doe');
    expect(actual.Comments).toBe('2024-12 - John Doe');
    expect(actual.InternalInfo).toBe('2024-12 - John Doe');
  });

  it('should handle projectMonth with only month (no consultant)', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      projectMonth: {
        projectMonthId: 'pm-123',
        month: '2024-12-01T00:00:00.000Z',
        consultantId: '',
        consultantName: '',
      },
    };

    const actual: CreateOrderRequest = fromInvoice(invoice, someClient);

    expect(actual.OrderTitle).toBe('2024-12');
    expect(actual.Comments).toBe('2024-12');
    expect(actual.InternalInfo).toBe('2024-12');
  });

  it('should set PeriodFrom and PeriodTill to full month without project', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      projectMonth: {
        projectMonthId: 'pm-123',
        month: '2024-12-01T00:00:00.000Z',
        consultantId: 'cons-123',
        consultantName: 'John Doe',
      },
    };

    const actual: CreateOrderRequest = fromInvoice(invoice, someClient);

    expect(actual.PeriodFrom).toBe('2024-12-01');
    expect(actual.PeriodTill).toBe('2024-12-31');
  });

  it('should use project startDate when project started in the month', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      projectMonth: {
        projectMonthId: 'pm-123',
        month: '2024-12-01T00:00:00.000Z',
        consultantId: 'cons-123',
        consultantName: 'John Doe',
      },
    };

    const project = {startDate: '2024-12-15T00:00:00.000Z'};

    const actual: CreateOrderRequest = fromInvoice(invoice, someClient, project as any);

    expect(actual.PeriodFrom).toBe('2024-12-15');
    expect(actual.PeriodTill).toBe('2024-12-31');
  });

  it('should use project endDate when project ended in the month', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      projectMonth: {
        projectMonthId: 'pm-123',
        month: '2024-12-01T00:00:00.000Z',
        consultantId: 'cons-123',
        consultantName: 'John Doe',
      },
    };

    const project = {
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: '2024-12-20T00:00:00.000Z',
    };

    const actual: CreateOrderRequest = fromInvoice(invoice, someClient, project as any);

    expect(actual.PeriodFrom).toBe('2024-12-01');
    expect(actual.PeriodTill).toBe('2024-12-20');
  });

  it('should use both project startDate and endDate when project started and ended in the month', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      projectMonth: {
        projectMonthId: 'pm-123',
        month: '2024-12-01T00:00:00.000Z',
        consultantId: 'cons-123',
        consultantName: 'John Doe',
      },
    };

    const project = {
      startDate: '2024-12-10T00:00:00.000Z',
      endDate: '2024-12-20T00:00:00.000Z',
    };

    const actual: CreateOrderRequest = fromInvoice(invoice, someClient, project as any);

    expect(actual.PeriodFrom).toBe('2024-12-10');
    expect(actual.PeriodTill).toBe('2024-12-20');
  });

  it('should use full month when project started/ended before/after', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      projectMonth: {
        projectMonthId: 'pm-123',
        month: '2024-12-01T00:00:00.000Z',
        consultantId: 'cons-123',
        consultantName: 'John Doe',
      },
    };

    const project = {
      startDate: '2024-11-10T00:00:00.000Z',
      endDate: '2025-01-20T00:00:00.000Z',
    };

    const actual: CreateOrderRequest = fromInvoice(invoice, someClient, project as any);

    expect(actual.PeriodFrom).toBe('2024-12-01');
    expect(actual.PeriodTill).toBe('2024-12-31');
  });

  it('should set ContractDocumentReference when project.client.ref exists', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      projectMonth: {
        projectMonthId: 'pm-123',
        month: '2024-12-01T00:00:00.000Z',
        consultantId: 'cons-123',
        consultantName: 'John Doe',
      },
    };

    const project = {
      startDate: '2024-01-01T00:00:00.000Z',
      client: {
        clientId: 'client-123',
        defaultInvoiceLines: [],
        ref: 'CONTRACT-2024-001',
      },
    };

    const actual: CreateOrderRequest = fromInvoice(invoice, someClient, project as any);

    expect(actual.ContractDocumentReference).toEqual([{ID: 'CONTRACT-2024-001'}]);
  });

  it('should not set ContractDocumentReference when project.client.ref is empty', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      projectMonth: {
        projectMonthId: 'pm-123',
        month: '2024-12-01T00:00:00.000Z',
        consultantId: 'cons-123',
        consultantName: 'John Doe',
      },
    };

    const project = {
      startDate: '2024-01-01T00:00:00.000Z',
      client: {
        clientId: 'client-123',
        defaultInvoiceLines: [],
      },
    };

    const actual: CreateOrderRequest = fromInvoice(invoice, someClient, project as any);

    expect(actual.ContractDocumentReference).toBeUndefined();
  });
});
