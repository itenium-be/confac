import moment from 'moment';

//const getInvoiceString = invoice => `${invoice.number} - ${invoice.client.name} (${invoice.date.format('YYYY-MM')})`;

export class InvoiceModel {
  static createNew(config, client) {
    var model = new InvoiceModel(config, {
      client,
      number: config.nextInvoiceNumber || 1,
    });
    model = model.setClient(client);
    return model;
  }

  get isNew() {
    return this._id === undefined;
  }

  constructor(config, obj = {}) {
    this._id = obj._id;
    this.number = obj.number || 1;
    this.client = obj.client;
    this.your = obj.company || config.company;
    this.date = obj.date || moment().subtract(1, 'months').endOf('month');
    this.orderNr = obj.orderNr || '';
    this.verified = obj.verified || false;
    this._lines = obj.lines || [];
  }

  get _lines() {
    return this.lines;
  }
  set _lines(value) {
    this.lines = value;
    this.money = this._calculateMoneys();
  }
  setLines(lines) {
    this._lines = lines;
    return this;
  }

  setClient(client) {
    this.client = client;
    this._lines = [this.getLine()];
    return this;
  }
  setNumber(number) {
    this.number = number;
    return this;
  }
  setDate(date) {
    this.date = date;
    return this;
  }
  setOrderNr(orderNr) {
    this.orderNr = orderNr;
    return this;
  }

  addLine() {
    this._lines = this._lines.concat([this.getLine(true)]);
    return this;
  }
  updateLine(index, updateWith) {
    var newArr = this.lines.slice();
    newArr[index] = Object.assign({}, newArr[index], updateWith);
    this._lines = newArr;
    return this;
  }
  removeLine(index) {
    var newArr = this.lines.slice();
    newArr.splice(index, 1);
    this._lines = newArr;
    return this;
  }

  getLine(getEmpty = false) {
    if (!this.client || getEmpty) {
      return {
        desc: '',
        hours: 0,
        rate: 0
      };
    }
    return {
      desc: this.client.rate.description,
      hours: 0,
      rate: this.client.rate.hourly
    };
  }

  static emptyMoney = function() {
    return {
      totalHours: 0,
      totalWithoutTax: 0,
      taxPercentage: 0,
      totalTax: 0,
      total: 0,
    };
  }

  _calculateMoneys() {
    if (!this.client) {
      return InvoiceModel.emptyMoney();
    }

    const totalHours = this._lines.reduce((prev, cur) => prev + cur.hours, 0);
    const totalWithoutTax = this._lines.reduce((prev, cur) => prev + cur.hours * cur.rate, 0);
    const taxPercentage = 21;
    const totalTax = totalWithoutTax / 100 * taxPercentage;
    return {
      totalHours,
      totalWithoutTax,
      taxPercentage,
      totalTax,
      total: totalWithoutTax + totalTax,
    };
  }
}
