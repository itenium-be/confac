import {fromInvoiceLine} from '../order-line.factory';
import {OrderLine} from '../../../../../../services/billit';
import {InvoiceLine} from '../../../../../../models/invoices';
import {someInvoiceLine} from '../../tests/invoice-line.fixture';

describe('fromInvoiceLine', () => {
  it('should create OrderLine from invoice line with all fields', () => {
    const invoiceLine: InvoiceLine = {
      sort: 0,
      desc: 'Consulting Services',
      amount: 10,
      price: 100,
      tax: 21,
      type: 'daily',
    };

    const expected: OrderLine = {
      Quantity: 10,
      UnitPriceExcl: 100,
      Unit: 'DAY',
      Description: 'Consulting Services',
      VATPercentage: 21,
    };

    const actual: OrderLine = fromInvoiceLine(invoiceLine);

    expect(actual).toEqual(expected);
  });

  it('should handle decimal prices and quantities', () => {
    const invoiceLine: InvoiceLine = {
      sort: 0,
      desc: 'Partial Day',
      amount: 0.5,
      price: 75.25,
      tax: 21,
      type: 'hourly',
    };

    const expected: OrderLine = {
      Quantity: 0.5,
      UnitPriceExcl: 75.25,
      Unit: 'HUR',
      Description: 'Partial Day',
      VATPercentage: 21,
    };

    const actual: OrderLine = fromInvoiceLine(invoiceLine);

    expect(actual).toEqual(expected);
  });

  it('should map all unit types correctly', () => {
    const testCases = [
      {type: 'daily', expectedUnit: 'DAY'},
      {type: 'hourly', expectedUnit: 'HUR'},
      {type: 'km', expectedUnit: 'KMT'},
      {type: 'items', expectedUnit: 'NAR'},
      {type: 'other', expectedUnit: 'C62'},
    ] as const;

    testCases.forEach(({type, expectedUnit}) => {
      const invoiceLine: InvoiceLine = {
        ...someInvoiceLine,
        type,
      };

      const actual: OrderLine = fromInvoiceLine(invoiceLine);

      expect(actual.Unit).toBe(expectedUnit);
    });
  });

  it('should use projectMonth description format when projectMonth is provided', () => {
    const invoiceLine: InvoiceLine = {
      sort: 0,
      desc: 'Consulting Services',
      amount: 10,
      price: 100,
      tax: 21,
      type: 'daily',
    };

    const actual: OrderLine = fromInvoiceLine(invoiceLine, {
      projectMonth: {
        projectMonthId: '123',
        month: '2026-01-15',
        consultantId: '456',
        consultantName: 'Tom Boonen',
      },
    });

    expect(actual.Description).toBe('Consultancy - 1/26 - Tom Boonen');
  });

  it('should fall back to line.desc when projectMonth has no consultantName', () => {
    const invoiceLine: InvoiceLine = {
      sort: 0,
      desc: 'Consulting Services',
      amount: 10,
      price: 100,
      tax: 21,
      type: 'daily',
    };

    const actual: OrderLine = fromInvoiceLine(invoiceLine, {
      projectMonth: {
        projectMonthId: '123',
        month: '2026-01-15',
        consultantId: '456',
        consultantName: '',
      },
    });

    expect(actual.Description).toBe('Consulting Services');
  });

  it('should return undefined Unit, Quantity, UnitPriceExcl, and VATPercentage for section type', () => {
    const invoiceLine: InvoiceLine = {
      sort: 0,
      desc: 'UK is VAT Excempt',
      type: 'section',
      amount: 1,
      price: 100,
      tax: 21,
    };

    const actual: OrderLine = fromInvoiceLine(invoiceLine);

    expect(actual.Unit).toBeUndefined();
    expect(actual.Quantity).toBeUndefined();
    expect(actual.UnitPriceExcl).toBeUndefined();
    expect(actual.VATPercentage).toBeUndefined();
    expect(actual.Description).toBe('UK is VAT Excempt');
  });
});
