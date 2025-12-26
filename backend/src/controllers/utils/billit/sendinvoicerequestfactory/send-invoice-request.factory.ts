import {SendInvoiceRequest, TransportType} from '../../../../services/billit';
import {IInvoice} from '../../../../models/invoices';

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

function getTransportType(invoice: IInvoice): TransportType {
  return invoice.client.peppolEnabled === true ? 'Peppol' : 'SMTP';
}
