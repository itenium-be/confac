import moment from 'moment';

//const getInvoiceString = invoice => `${invoice.number} - ${invoice.client.name} (${invoice.date.format('YYYY-MM')})`;

export default class EditInvoiceViewModel {
  static createNew(config, client) {
    var model = new EditInvoiceViewModel(config, {
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

  constructor(config, obj = {}) {
    this._defaultTax = config.defaultTax;
    this._defaultType = config.defaultInvoiceLineType;

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
    this.extraFields = obj.extraFields || [];
  }

  get _lines() {
    return this.lines;
  }
  set _lines(value) {
    this.lines = value;
    this.money = this._calculateMoneys();
    console.log('moneyz', this.money);
  }
  setLines(lines) {
    this._lines = lines;
    return this;
  }

  setClient(client) {
    this.client = client;
    this._lines = [this.getLine()];
    this.fileName = client ? client.invoiceFileName : '';
    this.extraFields = client ? (client.defaultExtraInvoiceFields || []) : [];
    return this;
  }
  addLine(line) {
    this._lines = this._lines.concat([line || this.getLine(true)]);
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

  updateField(key, value) {
    // HACK: Workaround for not updating state directly while
    // still having an instance of this class in component state
    this[key] = value;
  }

  getLine(getEmpty = false) {
    const defaultLine = {
      amount: 0,
      tax: this._defaultTax,
      type: this._defaultType,
    };

    if (!this.client || getEmpty) {
      return Object.assign(defaultLine, {
        desc: '',
        price: 0,
      });
    }

    return Object.assign(defaultLine, {
      desc: this.client.rate.description,
      price: this.client.rate.value,
    });
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

    const totalValue = this._lines.reduce((prev, cur) => prev + cur.amount, 0);
    const totalWithoutTax = this._lines.reduce((prev, cur) => prev + cur.amount * cur.price, 0);
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
