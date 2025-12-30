import {fromInvoice} from '../order-lines.factory';
import {OrderLine} from '../../../../../../services/billit';
import {IInvoice} from '../../../../../../models/invoices';
import {someInvoice} from '../../tests/invoice.fixture';
import {someInvoiceLine} from '../../tests/invoice-line.fixture';

describe('fromInvoice', () => {
  it('should create OrderLines from invoice with multiple lines', () => {
    const invoice: IInvoice = {
      ...someInvoice,
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

    const expected: OrderLine[] = [
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
    ];

    const actual: OrderLine[] = fromInvoice(invoice);

    expect(actual).toEqual(expected);
  });

  it('should create OrderLines from invoice with single line', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      lines: [
        {
          ...someInvoiceLine,
          desc: 'Consulting Services',
          amount: 10,
          price: 100,
          tax: 21,
        },
      ],
    };

    const expected: OrderLine[] = [
      {
        Quantity: 10,
        UnitPriceExcl: 100,
        Unit: 'DAY',
        Description: 'Consulting Services',
        VATPercentage: 21,
      },
    ];

    const actual: OrderLine[] = fromInvoice(invoice);

    expect(actual).toEqual(expected);
  });

  it('should create empty OrderLines array from invoice with no lines', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      lines: [],
    };

    const expected: OrderLine[] = [];

    const actual: OrderLine[] = fromInvoice(invoice);

    expect(actual).toEqual(expected);
  });
});
