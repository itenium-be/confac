import {OrderLine} from '../../../../services/billit';
import {IInvoice, InvoiceLine} from '../../../../models/invoices';

/**
 * Creates OrderLines from an IInvoice
 * @param invoice The invoice containing the lines to convert
 * @returns An array of OrderLine objects ready to be sent to Billit API
 */
export function fromInvoice(invoice: IInvoice): OrderLine[] {
  return invoice.lines.map(line => fromInvoiceLine(line));
}

/**
 * Creates an OrderLine from an InvoiceLine
 * @param invoiceLine The invoice line to convert
 * @returns An OrderLine object ready to be sent to Billit API
 */
function fromInvoiceLine(invoiceLine: InvoiceLine): OrderLine {
  const {
    amount: Quantity,
    price: UnitPriceExcl,
    desc: Description,
    tax: VATPercentage,
  } = invoiceLine;

  return {
    Quantity,
    UnitPriceExcl,
    Description,
    VATPercentage,
  };
}
