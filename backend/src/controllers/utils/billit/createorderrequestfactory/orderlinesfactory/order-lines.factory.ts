import {OrderLine} from '../../../../../services/billit';
import {IInvoice} from '../../../../../models/invoices';
import {fromInvoiceLine, OrderLineOptions} from './order-line.factory';

/**
 * Creates OrderLines from an IInvoice
 * @param invoice The invoice containing the lines to convert
 * @param options Options for creating order lines (invertAmounts, accountingCode)
 * @returns An array of OrderLine objects ready to be sent to Billit API
 */
export function fromInvoice(invoice: IInvoice, options: OrderLineOptions = {}): OrderLine[] {
  return invoice.lines.map((line, index) => {
    const lineOptions: OrderLineOptions = index === 0
      ? {...options, projectMonth: invoice.projectMonth}
      : options;
    return fromInvoiceLine(line, lineOptions);
  });
}
