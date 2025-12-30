import moment from 'moment/moment';
import {CreateOrderRequest} from '../../../../services/billit';
import {IInvoice} from '../../../../models/invoices';
import {fromClient as createCustomerFromClient} from './customer.factory';
import {fromInvoice as createOrderLinesFromInvoice} from './orderlinesfactory';
import {IClient} from '../../../../models/clients';

const InvoiceExpirationInDays: number = 30;

/** Create a Billit CreateOrderRequest */
export function fromInvoice(invoice: IInvoice, client: IClient): CreateOrderRequest {
  const {
    isQuotation,
    number,
    date,
    orderNr: Reference,
    paymentReference,
  } = invoice;

  if (isQuotation) {
    throw new Error('Quotation unsupported.');
  }

  return {
    OrderType: 'Invoice',
    OrderDirection: 'Income',
    OrderNumber: number.toString(),
    OrderDate: moment(date).format('YYYY-MM-DD'),
    ExpiryDate: moment().add(InvoiceExpirationInDays, 'days').format('YYYY-MM-DD'),
    Reference,
    Currency: 'EUR',
    PaymentReference: paymentReference,
    Customer: createCustomerFromClient(client),
    OrderLines: createOrderLinesFromInvoice(invoice),
  };
}
