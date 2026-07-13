import {IInvoice} from '../../../../models/invoices';
import {IdempotencyKeyFactory} from '../idempotency-key.factory';

const invoice = (attempt?: number) => ({number: 2737, billit: attempt === undefined ? {} : {attempt}}) as IInvoice;

describe('IdempotencyKeyFactory', () => {
  it('keys the first attempt by invoice number alone', () => {
    expect(IdempotencyKeyFactory.createOrder(invoice())).toBe('create-order-2737');
    expect(IdempotencyKeyFactory.sendInvoice(invoice())).toBe('send-invoice-2737');
  });

  it('keys an invoice without billit by invoice number alone', () => {
    const noBillit = {number: 2737} as IInvoice;

    expect(IdempotencyKeyFactory.createOrder(noBillit)).toBe('create-order-2737');
  });

  it('suffixes the attempt after a delete: Billit rejects a replayed key as a duplicate', () => {
    expect(IdempotencyKeyFactory.createOrder(invoice(1))).toBe('create-order-2737-1');
    expect(IdempotencyKeyFactory.sendInvoice(invoice(1))).toBe('send-invoice-2737-1');
  });

  it('keeps giving out a fresh key for every further delete', () => {
    expect(IdempotencyKeyFactory.createOrder(invoice(2))).toBe('create-order-2737-2');
  });

  it('treats attempt 0 as the first attempt', () => {
    expect(IdempotencyKeyFactory.createOrder(invoice(0))).toBe('create-order-2737');
  });
});
