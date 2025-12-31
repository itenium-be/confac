import {SendInvoiceRequest} from '../../../../services/billit';
import {IInvoice} from '../../../../models/invoices';
import {IClient} from '../../../../models/clients';

export function fromInvoice(invoice: IInvoice, client: IClient): SendInvoiceRequest {
  if (!invoice.billit?.orderId) {
    throw new Error(`Billit order id is not present on invoice ${invoice.number}.`);
  }

  return {
    TransportType: client.peppolEnabled ? 'Peppol' : 'SMTP',
    OrderIDs: [invoice.billit.orderId],
  };
}
