import {OrderLine} from '../../../../services/billit';
import {InvoiceLine} from '../../../../models/invoices';

/**
 * Creates an OrderLine from an InvoiceLine
 * @param invoiceLine The invoice line to convert
 * @returns An OrderLine object ready to be sent to Billit API
 */
export function fromInvoiceLine(invoiceLine: InvoiceLine): OrderLine {
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
