import moment, {Moment} from 'moment';
import {DefaultHoursInDay} from '../../client/models/getNewClient';
import {ConfigModel, ConfigCompanyModel} from '../../config/models/ConfigModel';
import {getInvoiceDate} from './invoice-date-strategy';
import {ClientModel, InvoiceClientModel} from '../../client/models/ClientModels';
import {Attachment, IAttachment, IAudit, IComment} from '../../../models';
import {InvoiceLine} from './InvoiceLineModels';
import {FullProjectMonthModel} from '../../project/models/FullProjectMonthModel';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import {holidaysService} from '../../../actions/holidays';


export type InvoiceMoney = {
  totalWithoutTax: number;
  totalTax: number;
  discount?: number | string;
  /**
   * The total amount, including tax with
   * discount, if any, already subtracted
   */
  total: number;
  totals: {
    // [x in EditClientRateType]: number // When create-react-app supports it
    daily?: number;
    hourly?: number;
  };
}



export interface InvoiceProjectMonth {
  projectMonthId?: string;
  month?: moment.Moment;

  consultantId?: string;
  consultantName?: string;
}


export type InvoiceBillitDeliveryDetails = {
  date: string;
  info: string;
  delivered: boolean;
  status: string;
}

export type InvoiceBillitMessage = {
  description: string;
  fileId: string;
  creationDate: string;
  transportType: string;
  success: boolean;
  trials: number;
  destination: string;
  messageDirection: string;
}

export type InvoiceBillitModel = {
  /** The Billit order ID, returned after creating the order in Billit */
  orderId?: number;
  /** Current Peppol/Email delivery details */
  delivery?: InvoiceBillitDeliveryDetails;
  messages?: InvoiceBillitMessage[];
}

export type InvoiceStatus = 'Draft' | 'ToSend' | 'ToPay' | 'Paid';



/**
 * The only invoice model
 * (InvoiceListModel is actually for filtering etc)
 */
export default class InvoiceModel implements IAttachment {
  private _config: ConfigModel;

  _id: string;
  number: number;
  client: InvoiceClientModel;
  your: ConfigCompanyModel;
  projectMonth?: InvoiceProjectMonth;
  date: moment.Moment;
  orderNr: string;
  status: InvoiceStatus;
  discount: string;
  attachments: Attachment[];
  isQuotation: boolean;
  /**
   * Before Peppol, this was the time the email was sent
   * After peppol this is when the invoice was sent to the peppol network
   **/
  lastEmail: string;
  audit: IAudit;
  lines: InvoiceLine[] = [];
  money: InvoiceMoney;
  note: string;
  comments: IComment[];
  creditNotas: string[];
  billit?: InvoiceBillitModel;
  paymentReference: string;

  get isNew(): boolean {
    return this._id === undefined;
  }

  /**
   * Whether the payment reference can still be updated.
   * Once status is ToPay or Paid, it should remain fixed.
   */
  get canUpdatePaymentReference(): boolean {
    return this.status === 'Draft' || this.status === 'ToSend';
  }


  constructor(config: ConfigModel, obj: any = {}) {
    this._id = obj._id;
    this.number = obj.number || 1;
    this.client = obj.client;
    this.your = obj.company || config.company;
    this.projectMonth = obj.projectMonth;
    this.date = obj.date;
    this.orderNr = obj.orderNr || '';
    this.status = obj.status || 'Draft';
    this.discount = obj.discount;
    this.attachments = obj.attachments || [{type: 'pdf', desc: 'Factuur pdf'}, {type: 'xml', desc: 'PEPPOL xml'}];
    this.isQuotation = obj.isQuotation || false;
    this.lastEmail = obj.lastEmail;
    this.note = obj.note || '';
    this.comments = obj.comments || [];

    this.money = this._calculateMoneys();

    this._lines = obj.lines || config.defaultInvoiceLines || [];
    this.audit = obj.audit;
    this._config = config;
    this.creditNotas = obj.creditNotas || [];
    this.billit = obj.billit;
    this.paymentReference = obj.paymentReference || calculatePaymentReference(this.number, this.projectMonth?.month);
  }

  /**
   * Recalculates and updates the payment reference if allowed.
   * Should be called when invoice number or projectMonth changes.
   */
  updatePaymentReference(): void {
    if (this.canUpdatePaymentReference) {
      this.paymentReference = calculatePaymentReference(this.number, this.projectMonth?.month);
    }
  }

  get config(): ConfigModel {
    return this._config;
  }

  getType(): 'quotation' | 'invoice' {
    return this.isQuotation ? 'quotation' : 'invoice';
  }

  get _lines(): InvoiceLine[] {
    return this.lines;
  }

  set _lines(value: InvoiceLine[]) {
    this.lines = value;
    this.money = this._calculateMoneys();
  }

  setLines(lines: InvoiceLine[]): InvoiceModel {
    this._lines = lines;
    return this;
  }

  /** Some weird stuff happening here that EditInvoice probably depends on */
  setClient(client: undefined | ClientModel): InvoiceModel {
    this.client = undefined as unknown as InvoiceClientModel;
    if (client) {
      this.client = {
        _id: client._id,
        name: client.name,
        slug: client.slug,
        street: client.street,
        streetNr: client.streetNr,
        streetBox: client.streetBox,
        city: client.city,
        postalCode: client.postalCode,
        country: client.country,
        language: client.language,
        telephone: client.telephone,
        btw: client.btw,
        hoursInDay: client.hoursInDay,
        invoiceFileName: client.invoiceFileName,
      };
    }

    this.date = getInvoiceDate(client, this.config);

    if (client && client.defaultInvoiceLines.length) {
      this._lines = client.defaultInvoiceLines.map(x => ({...x}));
    }

    return this;
  }

  updateField(key: string, value: any, calcMoneys = false): void {
    // HACK: Workaround for not updating state directly while
    // still having an instance of this class in component state
    this[key] = value;
    if (calcMoneys) {
      this.money = this._calculateMoneys();
    }
    if (key === 'number') {
      this.updatePaymentReference();
    }
  }

  setProjectMonth(fpm?: FullProjectMonthModel): void {
    if (!fpm) {
      this.projectMonth = undefined;
      this.updatePaymentReference();
      return;
    }

    this.projectMonth = {
      projectMonthId: fpm._id,
      month: fpm.details.month,
      consultantId: fpm.consultant._id,
      consultantName: `${fpm.consultant.firstName} ${fpm.consultant.name}`,
    };
    this.updatePaymentReference();
  }

  setManualProjectMonth(consultant?: ConsultantModel, month?: Moment): void {
    if (!consultant && !month) {
      this.projectMonth = undefined;
      this.updatePaymentReference();
      return;
    }

    this.projectMonth = {
      projectMonthId: undefined,
      month: month,
      consultantId: consultant?._id,
      consultantName: consultant ? `${consultant.firstName} ${consultant.name}` : undefined,
    };
    this.updatePaymentReference();
  }


  setCreditNotas(creditNotas: string[]) {
    this.creditNotas = creditNotas.filter(n => this._id !== n);
  }


  static emptyMoney(): InvoiceMoney {
    return {
      totalWithoutTax: 0,
      totalTax: 0,
      total: 0,
      totals: {},
    };
  }

  _calculateMoneys(): InvoiceMoney {
    if (!this.client) {
      return InvoiceModel.emptyMoney();
    }

    const relevantLines = this._lines.filter(line => line.type !== 'section');
    const totalWithoutTax = relevantLines.reduce((prev, cur) => prev + cur.amount * cur.price, 0);
    const totalTax = relevantLines.reduce((prev, cur) => prev + (cur.amount * cur.price * cur.tax) / 100, 0);
    let total = totalWithoutTax + totalTax;
    const totalsPerLineType = relevantLines.reduce((acc, cur) => {
      if (!acc[cur.type]) {
        acc[cur.type] = 0;
      }
      acc[cur.type] += cur.amount * cur.price;
      return acc;
    }, {});

    const discount = (this.discount || 0).toString().trim();
    let calcDiscount: number | string = discount;
    if (discount) {
      if (discount.slice(-1) === '%') {
        const discountPercentage = parseInt(discount.slice(0, -1), 10);
        total *= 1 - discountPercentage / 100;
      } else {
        const discountValue = parseInt(discount, 10);
        calcDiscount = discountValue;
        total -= discountValue;
      }
    }

    return {
      totalWithoutTax,
      totalTax,
      discount: calcDiscount,
      total,
      totals: totalsPerLineType,
    };
  }
}

export type InvoiceModelProps = {
  invoice: InvoiceModel;
}


/**
 * Days/hours worked
 */
export type DaysWorked = {
  daysWorked: number;
  hoursWorked: number;
}


/**
 * Calculate days/hours worked in invoice
 */
function daysCalc(invoice: InvoiceModel): DaysWorked {
  // Legacy: Old invoices without client.hoursInDay exist
  const hoursInDay = invoice.client.hoursInDay || DefaultHoursInDay;

  const daysWorked = invoice.lines.reduce((prev, cur) => {
    if (cur.type === 'daily') {
      return prev + cur.amount;
    }
    if (cur.type === 'hourly') {
      return prev + cur.amount / hoursInDay;
    }
    return prev;
  }, 0);

  const hoursWorked = invoice.lines.reduce((prev, cur) => {
    if (cur.type === 'daily') {
      return prev + cur.amount * hoursInDay;
    }
    if (cur.type === 'hourly') {
      return prev + cur.amount;
    }
    return prev;
  }, 0);

  return {
    daysWorked,
    hoursWorked,
  };
}


type GroupedInvoicesPerMonth = {
  invoiceList: InvoiceModel[];
  /** Month in format: YYYYMM */
  key: string;
}

export function groupInvoicesPerMonth(invoices: InvoiceModel[]): GroupedInvoicesPerMonth[] {
  return invoices.reduce((list: GroupedInvoicesPerMonth[], invoice: InvoiceModel) => {
    const month = invoice.date.format('YYYYMM');
    const invoicesForMonth = list.find(i => i.key === month);
    if (invoicesForMonth) {
      invoicesForMonth.invoiceList.push(invoice);
    } else {
      list.push({key: month, invoiceList: [invoice]});
    }
    return list;
  }, []);
}



export function getWorkDaysInMonths(invoices: InvoiceModel[]): number {
  const invoicesPerMonth = groupInvoicesPerMonth(invoices);
  const result = invoicesPerMonth.map(({invoiceList}) => holidaysService.get(invoiceList[0].date));
  return result.reduce((prev, cur) => prev + cur, 0);
}



export function calculateDaysWorked(invoices: InvoiceModel[]): DaysWorked {
  const invoiceDays = invoices.map(daysCalc);
  const invoiceDayTotals = invoiceDays.reduce((a, b) => ({
    daysWorked: a.daysWorked + b.daysWorked,
    hoursWorked: a.hoursWorked + b.hoursWorked,
  }), {daysWorked: 0, hoursWorked: 0});

  return invoiceDayTotals;
}


/**
 * Calculates a Belgian structured payment reference.
 * Format: +++YMM/nnnn/XXcc+++
 * - YMM: last digit of year + 2 digit month from projectMonth (or 000 if no projectMonth)
 * - nnnn: invoice number (4 digits, padded with zeros)
 * - XX: overflow if invoiceNr > 9999 (otherwise 00)
 * - cc: check digits (mod 97)
 */
export function calculatePaymentReference(invoiceNumber: number, projectMonth?: moment.Moment): string {
  let ymm = '000';
  if (projectMonth) {
    const projectMonthMoment = moment(projectMonth);
    const year = projectMonthMoment.year() % 10;
    const month = (projectMonthMoment.month() + 1).toString().padStart(2, '0');
    ymm = `${year}${month}`;
  }

  const invoiceStr = invoiceNumber.toString().padStart(4, '0');
  const mainPart = invoiceStr.substring(0, 4);
  const overflowStr = invoiceStr.length > 4 ? invoiceStr.substring(4) : '';
  const overflow = overflowStr.padEnd(2, '0');

  const baseNumber = parseInt(`${ymm}${mainPart}${overflow}`, 10);
  let checkDigits = baseNumber % 97;
  if (checkDigits === 0) {
    checkDigits = 97;
  }
  const checkDigitsStr = checkDigits.toString().padStart(2, '0');

  return `+++${ymm}/${mainPart}/${overflow}${checkDigitsStr}+++`;
}
