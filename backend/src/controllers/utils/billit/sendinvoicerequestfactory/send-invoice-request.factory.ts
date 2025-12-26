import {SendInvoiceRequest} from '../../../../services/billit';
import {IInvoice} from '../../../../models/invoices';
import {fromInvoice as getTransportType} from './transport-type.factory';

export function fromInvoice(invoice: IInvoice): SendInvoiceRequest {
  const {billitOrderId, number} = invoice;
  if (!billitOrderId) {
    throw new Error(`Billit order id is not present on invoice ${number}.`);
  }
  return {
    TransportType: getTransportType(invoice),
    OrderIDs: [billitOrderId],
  };
}
