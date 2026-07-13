import {IInvoice} from '../../../models/invoices';

/**
 * Billit rejects a replayed idempotency key as a duplicate, so a send that follows a
 * "Delete in Billit" has to use a different one: hence the attempt suffix.
 */
function build(prefix: string, invoice: IInvoice): string {
  const attempt = invoice.billit?.attempt;
  const key = `${prefix}-${invoice.number}`;
  return attempt ? `${key}-${attempt}` : key;
}

export const IdempotencyKeyFactory = {
  createOrder: (invoice: IInvoice): string => build('create-order', invoice),
  sendInvoice: (invoice: IInvoice): string => build('send-invoice', invoice),
};
