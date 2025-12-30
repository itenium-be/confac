import moment from 'moment/moment';
import {CreateOrderRequest} from '../../../../services/billit';
import {IInvoice, InvoiceProjectMonth} from '../../../../models/invoices';
import {fromClient as createCustomerFromClient} from './customer.factory';
import {fromInvoice as createOrderLinesFromInvoice} from './orderlinesfactory';
import {IClient} from '../../../../models/clients';
import {IProject} from '../../../../models/projects';

const InvoiceExpirationInDays: number = 30;

function getOrderDescription(projectMonth?: InvoiceProjectMonth): string | undefined {
  if (!projectMonth) {
    return undefined;
  }

  const parts: string[] = [];

  if (projectMonth.month) {
    parts.push(moment(projectMonth.month).format('YYYY-MM'));
  }

  if (projectMonth.consultantName) {
    parts.push(projectMonth.consultantName);
  }

  return parts.length > 0 ? parts.join(' - ') : undefined;
}

/** Create a Billit CreateOrderRequest */
export function fromInvoice(invoice: IInvoice, client: IClient): CreateOrderRequest {
  const {
    isQuotation,
    number,
    date,
    orderNr: Reference,
    paymentReference,
    projectMonth,
  } = invoice;

  if (isQuotation) {
    throw new Error('Quotation unsupported.');
  }

  const orderDescription = getOrderDescription(projectMonth);

  return {
    OrderType: 'Invoice',
    OrderDirection: 'Income',
    OrderNumber: number.toString(),
    OrderDate: moment(date).format('YYYY-MM-DD'),
    ExpiryDate: moment().add(InvoiceExpirationInDays, 'days').format('YYYY-MM-DD'),
    Reference,
    OrderTitle: orderDescription,
    Comments: orderDescription,
    InternalInfo: orderDescription,
    Currency: 'EUR',
    PaymentReference: paymentReference,
    Customer: createCustomerFromClient(client),
    OrderLines: createOrderLinesFromInvoice(invoice),
  };
}
