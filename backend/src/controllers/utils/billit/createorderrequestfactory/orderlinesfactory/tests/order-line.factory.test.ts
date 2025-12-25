import {fromInvoiceLine} from '../order-line.factory';
import {OrderLine} from '../../../../../../services/billit';
import {InvoiceLine} from '../../../../../../models/invoices';
import {someInvoiceLine} from '../../tests/invoice-line.fixture';

describe('fromInvoiceLine', () => {
  it('should create OrderLine from invoice line with all fields', () => {
    const invoiceLine: InvoiceLine = {
      ...someInvoiceLine,
      desc: 'Consulting Services',
      amount: 10,
      price: 100,
      tax: 21,
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
      ...someInvoiceLine,
      desc: 'Partial Day',
      amount: 0.5,
      price: 75.25,
      tax: 21,
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
