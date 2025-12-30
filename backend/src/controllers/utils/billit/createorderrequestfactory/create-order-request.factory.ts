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

type OrderPeriod = {
  periodFrom?: string;
  periodTill?: string;
};

function getOrderPeriod(projectMonth?: InvoiceProjectMonth, project?: IProject): OrderPeriod {
  if (!projectMonth?.month) {
    return {};
  }

  const month = moment(projectMonth.month);
  const startOfMonth = month.clone().startOf('month');
  const endOfMonth = month.clone().endOf('month');

  let periodFrom = startOfMonth;
  let periodTill = endOfMonth;

  if (project) {
    const projectStart = moment(project.startDate);
    const projectEnd = project.endDate ? moment(project.endDate) : null;

    // If project started in this month, use project start date
    if (projectStart.isSameOrAfter(startOfMonth) && projectStart.isSameOrBefore(endOfMonth)) {
      periodFrom = projectStart;
    }

    // If project ended in this month, use project end date
    if (projectEnd && projectEnd.isSameOrAfter(startOfMonth) && projectEnd.isSameOrBefore(endOfMonth)) {
      periodTill = projectEnd;
    }
  }

  return {
    periodFrom: periodFrom.format('YYYY-MM-DD'),
    periodTill: periodTill.format('YYYY-MM-DD'),
  };
}

/** Create a Billit CreateOrderRequest */
export function fromInvoice(invoice: IInvoice, client: IClient, project?: IProject): CreateOrderRequest {
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
  const {periodFrom, periodTill} = getOrderPeriod(projectMonth, project);

  return {
    // OrderID: invoice.billit.orderId,
    OrderType: 'Invoice',
    OrderDirection: 'Income',
    OrderNumber: number.toString(),
    OrderDate: moment(date).format('YYYY-MM-DD'),
    ExpiryDate: moment().add(InvoiceExpirationInDays, 'days').format('YYYY-MM-DD'),
    PeriodFrom: periodFrom,
    PeriodTill: periodTill,
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
