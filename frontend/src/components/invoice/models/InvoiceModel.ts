import moment, {Moment} from 'moment';
import {DefaultHoursInDay} from '../../client/models/getNewClient';
import {ConfigModel, ConfigCompanyModel} from '../../config/models/ConfigModel';
import {getInvoiceDate} from './invoice-date-strategy';
import {ClientModel} from '../../client/models/ClientModels';
import {Attachment, IAttachment, IAudit} from '../../../models';
import {InvoiceLine} from './InvoiceLineModels';
import {FullProjectMonthModel} from '../../project/models/FullProjectMonthModel';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import { holidaysService } from '../../../actions/holidays';


export type InvoiceMoney = {
  totalWithoutTax: number,
  totalTax: number,
  discount?: number | string,
  total: number,
  totals: {
    // [x in EditClientRateType]: number // When create-react-app supports it
    daily?: number,
    hourly?: number,
  }
}



export interface InvoiceProjectMonth {
  projectMonthId?: string;
  month?: moment.Moment;

  consultantId?: string;
  consultantName?: string;
}



/**
 * The only invoice model
 * (InvoiceListModel is actually for filtering etc)
 */
export default class InvoiceModel implements IAttachment {
  _id: string;
  number: number;
  client: ClientModel;
  your: ConfigCompanyModel;
  projectMonth?: InvoiceProjectMonth;
  date: moment.Moment;
  orderNr: string;
  verified: boolean;
  discount: string;
  attachments: Attachment[];
  isQuotation: boolean;
  lastEmail: string;
  audit: IAudit;
  lines: InvoiceLine[] = [];
  money: InvoiceMoney;
  note: string;

  get isNew(): boolean {
    return this._id === undefined;
  }

  constructor(config: ConfigModel, obj: any = {}) {
    this._id = obj._id;
    this.number = obj.number || 1;
    this.client = obj.client;
    this.your = obj.company || config.company;
    this.projectMonth = obj.projectMonth;
    this.date = obj.date;
    this.orderNr = obj.orderNr || '';
    this.verified = obj.verified || false;
    this.discount = obj.discount;
    this.attachments = obj.attachments || [{type: 'pdf'}];
    this.isQuotation = obj.isQuotation || false;
    this.lastEmail = obj.lastEmail;
    this.note = obj.note || '';

    this.money = this._calculateMoneys();

    this._lines = obj.lines || config.defaultInvoiceLines || [];
    this.audit = obj.audit;
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
    this.client = client as ClientModel;
    this.date = getInvoiceDate(client);

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
  }

  setProjectMonth(fpm?: FullProjectMonthModel): void {
    if (!fpm) {
      this.projectMonth = undefined;
      return;
    }

    this.projectMonth = {
      projectMonthId: fpm._id,
      month: fpm.details.month,
      consultantId: fpm.consultant._id,
      consultantName: `${fpm.consultant.firstName} ${fpm.consultant.name}`,
    };
  }

  setManualProjectMonth(consultant?: ConsultantModel, month?: Moment): void {
    if (!consultant && !month) {
      this.projectMonth = undefined;
      return;
    }

    this.projectMonth = {
      projectMonthId: undefined,
      month: month,
      consultantId: consultant?._id,
      consultantName: consultant ? `${consultant.firstName} ${consultant.name}` : undefined,
    };
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
  invoice: InvoiceModel
}


/**
 * Days/hours worked
 */
export type DaysWorked = {
  daysWorked: number,
  hoursWorked: number,
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
  invoiceList: InvoiceModel[],
  /** Month in format: YYYYMM */
  key: string,
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
