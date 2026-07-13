import {IInvoiceBillit, IInvoiceBillitError} from '../../../../models/invoices';
import {BillitOrder} from '../createorder';
import {mapBillitOrderToInvoiceBillit} from '../sync-order';

const billitOrder = {
  OrderID: 128275964,
  OrderStatus: 'ToPay',
} as BillitOrder;

const sendError: IInvoiceBillitError = {
  date: '2026-07-13T08:00:00.000Z',
  operation: 'sendInvoice',
  message: 'Failed to send invoice via Peppol',
  billitErrors: [{Code: 'PleaseSupplyAValidPONumberInTheFieldYourReference'}],
};

describe('mapBillitOrderToInvoiceBillit', () => {
  it('keeps the errors already stored on the invoice: Billit does not know about them', () => {
    const current: IInvoiceBillit = {orderId: 128275964, errors: [sendError]};

    const result = mapBillitOrderToInvoiceBillit(billitOrder, current);

    expect(result.errors).toEqual([sendError]);
  });

  it('leaves out errors when the invoice has none', () => {
    const result = mapBillitOrderToInvoiceBillit(billitOrder, {orderId: 128275964});

    expect(result.errors).toBeUndefined();
  });

  it('keeps the aboutInvoiceNumber of a credit note', () => {
    const result = mapBillitOrderToInvoiceBillit(billitOrder, {orderId: 128275964, aboutInvoiceNumber: 2701});

    expect(result.aboutInvoiceNumber).toBe(2701);
  });
});
