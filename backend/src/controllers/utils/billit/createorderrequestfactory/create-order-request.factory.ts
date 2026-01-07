import moment, {Moment} from 'moment/moment';
import {ContractDocumentReference, CreateOrderRequest} from '../../../../services/billit';
import {IInvoice, InvoiceProjectMonth} from '../../../../models/invoices';
import {fromClient as createCustomerFromClient} from './customer.factory';
import {fromInvoice as createOrderLinesFromInvoice} from './orderlinesfactory';
import {IClient} from '../../../../models/clients';
import {IProject} from '../../../../models/projects';

const InvoiceExpirationInDays: number = 30;

export type CreditNoteOptions = {
  /** The original invoice that this credit note is for */
  originalInvoice: IInvoice;
  /** The peppol pivot date from config */
  peppolPivotDate: Moment;
};

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

type PaymentDiscount = {
  PaymentDiscountPercentage?: number;
  PaymentDiscountAmount?: number;
};

function getPaymentDiscount(invoice: IInvoice): PaymentDiscount {
  if (!invoice.money.discount) {
    return {};
  }

  // Discount is already calculated, take that exact amount so that
  // we do not duplicate the calculation done on the frontend.
  const discount = invoice.money.totalWithoutTax + invoice.money.totalTax - invoice.money.total;
  return {
    PaymentDiscountPercentage: undefined,
    PaymentDiscountAmount: discount,
  };
}

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
export function fromInvoice(
  invoice: IInvoice,
  client: IClient,
  project?: IProject,
  creditNoteOptions?: CreditNoteOptions,
): CreateOrderRequest {
  if (invoice.isQuotation) {
    throw new Error('Quotation unsupported.');
  }

  const hasLinkedInvoice = invoice.creditNotas?.length > 0;
  const isCreditNote = hasLinkedInvoice && invoice.money.total < 0;

  const orderDescription = getOrderDescription(invoice.projectMonth);
  const {periodFrom, periodTill} = getOrderPeriod(invoice.projectMonth, project);
  const {PaymentDiscountPercentage, PaymentDiscountAmount} = getPaymentDiscount(invoice);

  let contractDocumentReference: ContractDocumentReference[] | undefined;
  if (project?.client?.ref) {
    contractDocumentReference = [{ID: project.client.ref}];
  }

  // Set AboutInvoiceNumber for linked invoices if original invoice was created on or after peppol pivot date
  let aboutInvoiceNumber: string | undefined;
  if (hasLinkedInvoice && creditNoteOptions) {
    const {originalInvoice, peppolPivotDate} = creditNoteOptions;
    const originalCreatedOn = moment(originalInvoice.audit?.createdOn);
    if (originalCreatedOn.isSameOrAfter(peppolPivotDate, 'day')) {
      aboutInvoiceNumber = originalInvoice.number.toString();
    }
  }

  console.log(`invoice creditNote=${isCreditNote} for invoice nr ${aboutInvoiceNumber}`);
  console.log('orderLines', JSON.stringify(createOrderLinesFromInvoice(invoice, isCreditNote)[0]));

  return {
    OrderType: isCreditNote ? 'CreditNote' : 'Invoice',
    OrderDirection: 'Income',
    OrderNumber: invoice.number.toString(),
    OrderDate: moment(invoice.date).format('YYYY-MM-DD'),
    ExpiryDate: moment().add(InvoiceExpirationInDays, 'days').format('YYYY-MM-DD'),
    PeriodFrom: periodFrom,
    PeriodTill: periodTill,
    Reference: invoice.orderNr,
    OrderTitle: orderDescription,
    Comments: orderDescription,
    InternalInfo: orderDescription,
    Currency: 'EUR',
    PaymentReference: invoice.paymentReference,
    PaymentDiscountPercentage,
    PaymentDiscountAmount,
    ContractDocumentReference: contractDocumentReference,
    AboutInvoiceNumber: aboutInvoiceNumber,
    Customer: createCustomerFromClient(client),
    OrderLines: createOrderLinesFromInvoice(invoice, isCreditNote),
  };
}
