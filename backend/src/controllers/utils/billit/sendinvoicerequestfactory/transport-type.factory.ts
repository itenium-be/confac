import {TransportType} from '../../../../services/billit';
import {IInvoice} from '../../../../models/invoices';

export function fromInvoice(invoice: IInvoice): TransportType {
  return invoice.client.peppolEnabled === true ? 'Peppol' : 'SMTP';
}
