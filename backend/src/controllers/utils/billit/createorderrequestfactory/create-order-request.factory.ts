import moment from 'moment/moment';
import {CreateOrderRequest} from '../../../../services/billit';
import {IInvoice} from '../../../../models/invoices';
import {fromClient as createCustomerFromClient} from './customer.factory';
import {fromInvoice as createOrderLinesFromInvoice} from './orderlinesfactory';
import {fromInvoice as createPaymentReferenceFromInvoice} from './payment-reference.factory';

/**
 * Creates a CreateOrderRequest from an IInvoice
 * @param invoice The invoice to convert
 * @returns A CreateOrderRequest object ready to be sent to Billit API
 */
export function fromInvoice(invoice: IInvoice): CreateOrderRequest {
  const {
    isQuotation,
    number,
    date,
    orderNr: Reference,
    client,
  } = invoice;

  if (isQuotation) {
    throw new Error('Quotation unsupported.');
  }

  return {
    OrderType: 'Invoice',
    OrderDirection: 'Income',
    OrderNumber: number.toString(),
    OrderDate: moment(date).format('YYYY-MM-DD'),
    ExpiryDate: moment().add(14, 'days').format('YYYY-MM-DD'), // 14 days from now, TODO: Make configurable
    Reference,
    Currency: 'EUR',
    PaymentReference: createPaymentReferenceFromInvoice(invoice),
    Customer: createCustomerFromClient(client),
    OrderLines: createOrderLinesFromInvoice(invoice),
  };
}
