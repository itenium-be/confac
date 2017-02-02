import moment from 'moment';

//const getInvoiceString = invoice => `${invoice.number} - ${invoice.client.name} (${invoice.date.format('YYYY-MM')})`;

export default class EditInvoiceViewModel {
  static createNew(config, client) {
    var model = new EditInvoiceViewModel(config, {
      client,
      number: 1,
      fileName: client ? client.invoiceFileName : '',
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
    this.date = obj.date || moment(); //.subtract(1, 'months').endOf('month');
    this.orderNr = obj.orderNr || '';
    this.verified = obj.verified || false;
    this._lines = obj.lines || [];
    this.fileName = obj.fileName;
    this.attachments = obj.attachments || [{type: 'pdf'}];
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
    this.fileName = client ? client.invoiceFileName : '';
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
  setFileName(fileName) {
    this.fileName = fileName;
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
        type: 'hourly',
        desc: '',
        value: 0,
        rate: 0
      };
    }
    return {
      type: 'hourly',
      desc: this.client.rate.description,
      value: 0,
      rate: this.client.rate.value
    };
  }

  static emptyMoney = function() {
    return {
      totalValue: 0,
      totalWithoutTax: 0,
      taxPercentage: 0,
      totalTax: 0,
      total: 0,
    };
  }

  _calculateMoneys() {
    if (!this.client) {
      return EditInvoiceViewModel.emptyMoney();
    }

    const totalValue = this._lines.reduce((prev, cur) => prev + cur.value, 0);
    const totalWithoutTax = this._lines.reduce((prev, cur) => prev + cur.value * cur.rate, 0);
    const taxPercentage = 21;
    const totalTax = totalWithoutTax / 100 * taxPercentage;
    return {
      totalValue,
      totalWithoutTax,
      taxPercentage,
      totalTax,
      total: totalWithoutTax + totalTax,
    };
  }
}
