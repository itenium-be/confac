import {fromInvoiceLine} from '../order-line.factory';
import {OrderLine} from '../../../../../services/billit';
import {InvoiceLine} from '../../../../../models/invoices';

describe('fromInvoiceLine', () => {
  it('should create OrderLine from invoice line with all fields', () => {
    const invoiceLine: InvoiceLine = {
      desc: 'Consulting Services',
      amount: 10,
      type: 'daily',
      price: 100,
      tax: 21,
      sort: 0,
    };

    const expected: OrderLine = {
      Quantity: 10,
      UnitPriceExcl: 100,
      Description: 'Consulting Services',
      VATPercentage: 21,
    };

    const actual: OrderLine = fromInvoiceLine(invoiceLine);

    expect(actual).toEqual(expected);
  });

  it('should handle decimal prices and quantities', () => {
    const invoiceLine: InvoiceLine = {
      desc: 'Partial Day',
      amount: 0.5,
      type: 'daily',
      price: 75.25,
      tax: 21,
      sort: 0,
    };

    const expected: OrderLine = {
      Quantity: 0.5,
      UnitPriceExcl: 75.25,
      Description: 'Partial Day',
      VATPercentage: 21,
    };

    const actual: OrderLine = fromInvoiceLine(invoiceLine);

    expect(actual).toEqual(expected);
  });
});
