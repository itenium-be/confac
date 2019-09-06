import { ConfigModel, ConfigCompanyModel } from '../../config/models/ConfigModel';
import {getInvoiceDate} from './invoice-date-strategy';
import { ClientModel } from '../../client/models/ClientModels';
import moment from 'moment';
import { Attachment, EditClientRateType, IAttachment, SelectItem } from '../../../models';


//const getInvoiceString = invoice => `${invoice.number} - ${invoice.client.name} (${invoice.date.format('YYYY-MM')})`;

export type InvoiceLine = {
  desc: string,
  amount: number,
  type: EditClientRateType,
  price: number,
  tax: number,
  sort: number,
  notes?: string,
}

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

/**
 * The only invoice model
 * (InvoiceListModel is actually for filtering etc)
 */
export default class InvoiceModel implements IAttachment {
  _id: string;
  number: number;
  client: ClientModel;
  your: ConfigCompanyModel;
  date: moment.Moment;
  orderNr: string;
  verified: boolean;
  fileName: string;
  discount: string;
  attachments: Attachment[];
  isQuotation: boolean;

  _defaultTax: number;
  _defaultType: EditClientRateType;
  extraFields: SelectItem[];
  createdOn: string;
  lines: InvoiceLine[] = [];
  money: InvoiceMoney;

  static createNew(config: ConfigModel, client: undefined | ClientModel): InvoiceModel {
    // debugger;
    var model = new InvoiceModel(config, {
      client,
      number: 1,
      fileName: client ? client.invoiceFileName : '',
      extraFields: client ? client.defaultExtraInvoiceFields : config.defaultExtraClientInvoiceFields,
    });
    model = model.setClient(client);
    return model;
  }

  get isNew() {
    return this._id === undefined;
  }

  constructor(config: ConfigModel, obj: any = {}) {
    this._defaultTax = config.defaultTax;
    this._defaultType = config.defaultInvoiceLineType;

    this._id = obj._id;
    this.number = obj.number || 1;
    this.client = obj.client;
    this.your = obj.company || config.company;
    this.date = obj.date || getInvoiceDate(this.client, config);
    this.orderNr = obj.orderNr || '';
    this.verified = obj.verified || false;
    this.fileName = obj.fileName || config.invoiceFileName;
    this.discount = obj.discount;
    this.attachments = obj.attachments || [{type: 'pdf'}];
    this.extraFields = obj.extraFields || [];
    this.isQuotation = obj.isQuotation || false;

    this.money = this._calculateMoneys();

    this._lines = obj.lines || [];
    this.createdOn = obj.createdOn;
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

  setClient(client: undefined | ClientModel): InvoiceModel {

    this.client = client as ClientModel;
    if (!this.lines || this.lines.length <= 1) {
      this._lines = [this.getLine()];
    }
    this.fileName = client ? client.invoiceFileName : this.fileName;
    if (!this.extraFields.length) {
      this.extraFields = client ? (client.defaultExtraInvoiceFields || []) : [];
    }
    this._defaultType = client && client.rate ? client.rate.type : this._defaultType;
    if (client && client.defaultInvoiceDateStrategy) {
      this.date = getInvoiceDate(client);
    }
    return this;
  }
  addLine(line?: InvoiceLine): InvoiceModel {
    this._lines = this._lines.concat([line || this.getLine(true)]);
    return this;
  }
  updateLine(index: number, updateWith: InvoiceLine | object): InvoiceModel {
    var newArr = this.lines.slice();

    this.daysVsHoursSwitchFix(newArr[index], updateWith);

    newArr[index] = Object.assign({}, newArr[index], updateWith);
    this._lines = newArr;
    return this;
  }
  removeLine(index: number): InvoiceModel {
    var newArr = this.lines.slice();
    newArr.splice(index, 1);
    this._lines = newArr;
    return this;
  }
  /**
   * Switch location of two InvoiceLines
   */
  reorderLines(startIndex: number, endIndex: number): InvoiceModel {
    var newArr = this.lines.slice();
    const [removed] = newArr.splice(startIndex, 1);
    newArr.splice(endIndex, 0, removed);
    this._lines = newArr;
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

  daysVsHoursSwitchFix(oldLine: InvoiceLine, updateWith: InvoiceLine | any): void {
    if (updateWith.type && updateWith.type !== oldLine.type && (oldLine.price || oldLine.amount)
      && this.client && this.client.rate && this.client.rate.hoursInDay) {

      const newType = updateWith.type;
      const oldType = oldLine.type;

      if (oldType === 'daily' && newType === 'hourly') {
        if (oldLine.price) {
          oldLine.price /= this.client.rate.hoursInDay;
        }
        if (oldLine.amount) {
          oldLine.amount *= this.client.rate.hoursInDay;
        }

      } else if (oldType === 'hourly' && newType === 'daily') {
        if (oldLine.price) {
          oldLine.price *= this.client.rate.hoursInDay;
        }
        if (oldLine.amount) {
          oldLine.amount /= this.client.rate.hoursInDay;
        }
      }
    }
  }

  getLine(getEmpty = false): InvoiceLine {
    const defaultLine: InvoiceLine = {
      desc: '',
      price: 0,
      amount: 0,
      tax: this._defaultTax,
      type: this._defaultType,
      sort: this._lines.reduce((acc, line) => acc <= line.sort ? line.sort + 1 : acc, 0),
    };

    if (!this.client || getEmpty) {
      return Object.assign(defaultLine, {
        desc: '',
        price: this.client ? this.client.rate.value : 0,
      });
    }

    return Object.assign(defaultLine, {
      desc: this.client.rate.description,
      price: this.client.rate.value,
    });
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
    const totalTax = relevantLines.reduce((prev, cur) => prev + cur.amount * cur.price * cur.tax / 100, 0);
    var total = totalWithoutTax + totalTax;
    var totalsPerLineType = relevantLines.reduce((acc, cur) => {
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
  const daysWorked = invoice.lines.reduce((prev, cur) => {
    if (cur.type === 'daily') {
      return prev + cur.amount;
    }
    if (cur.type === 'hourly') {
      return prev + cur.amount / invoice.client.rate.hoursInDay;
    }
    return prev;
  }, 0);

  const hoursWorked = invoice.lines.reduce((prev, cur) => {
    if (cur.type === 'daily') {
      return prev + cur.amount * invoice.client.rate.hoursInDay;
    }
    if (cur.type === 'hourly') {
      return prev + cur.amount;
    }
    return prev;
  }, 0);

  return {
    daysWorked: daysWorked,
    hoursWorked: hoursWorked,
  };
}


type GroupedInvoicesPerMonth = {
  invoiceList: InvoiceModel[],
  /**
   * Month in format: YYYYMM
   */
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


function getWorkDaysInMonth(momentInst: moment.Moment): Date[] {
  const curMonth = momentInst.month();

  var date = new Date(momentInst.year(), curMonth, 1);
  var result: Date[] = [];
  while (date.getMonth() === curMonth) {
    // date.getDay = index of ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      result.push(date);
    }
    date.setDate(date.getDate() + 1);
  }
  return result;
}

function getWorkDaysInMonths(invoices: InvoiceModel[]): number {
  const invoicesPerMonth = groupInvoicesPerMonth(invoices);
  const result = invoicesPerMonth.map(({invoiceList}) => getWorkDaysInMonth(invoiceList[0].date).length);
  return result.reduce((prev, cur) => prev + cur, 0);
}



export function calculateDaysWorked(invoices: InvoiceModel[]): DaysWorked & {workDaysInMonth: number} {
  const invoiceDays = invoices.map(daysCalc);
  const invoiceDayTotals = invoiceDays.reduce((a, b) => ({
    daysWorked: a.daysWorked + b.daysWorked,
    hoursWorked: a.hoursWorked + b.hoursWorked,
  }), {daysWorked: 0, hoursWorked: 0});


  const workDaysInMonth = getWorkDaysInMonths(invoices);
  const result = Object.assign(invoiceDayTotals, {workDaysInMonth});
  return result;
}
