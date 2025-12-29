import {SendInvoiceRequest} from '../../../../services/billit';
import {IInvoice} from '../../../../models/invoices';
import {fromInvoice as getTransportType} from './transport-type.factory';

export function fromInvoice(invoice: IInvoice): SendInvoiceRequest {
  if (!invoice.billit?.orderId) {
    throw new Error(`Billit order id is not present on invoice ${invoice.number}.`);
  }
  return {
    TransportType: getTransportType(invoice),
    OrderIDs: [invoice.billit.orderId],
  };
}
