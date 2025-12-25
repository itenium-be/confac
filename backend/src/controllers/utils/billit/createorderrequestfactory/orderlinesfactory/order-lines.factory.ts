import {OrderLine} from '../../../../../services/billit';
import {IInvoice} from '../../../../../models/invoices';
import {fromInvoiceLine} from './order-line.factory';

/**
 * Creates OrderLines from an IInvoice
 * @param invoice The invoice containing the lines to convert
 * @returns An array of OrderLine objects ready to be sent to Billit API
 */
export function fromInvoice(invoice: IInvoice): OrderLine[] {
  return invoice.lines.map(line => fromInvoiceLine(line));
}
