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
    this._defaultType = client && client.rate ? client.rate.type : this._defaultType;
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
        price: this.client ? this.client.rate.value : 0,
      });
    }

    return Object.assign(defaultLine, {
      desc: this.client.rate.description,
      price: this.client.rate.value,
    });
  }

  static emptyMoney = function() {
    return {
      totalWithoutTax: 0,
      totalTax: 0,
      total: 0,
    };
  }

  _calculateMoneys() {
    if (!this.client) {
      return EditInvoiceViewModel.emptyMoney();
    }

    const totalWithoutTax = this._lines.reduce((prev, cur) => prev + cur.amount * cur.price, 0);
    const totalTax = this._lines.reduce((prev, cur) => prev + cur.amount * cur.price * cur.tax / 100, 0);
    return {
      totalWithoutTax,
      totalTax,
      total: totalWithoutTax + totalTax,
    };
  }
}



function daysCalc(invoice) {
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

export function groupInvoicesPerMonth(invoices) {
  return invoices.reduce((list, invoice) => {
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


function getWorkDaysInMonth(momentInst) {
  const curMonth = momentInst.month();

  var date = new Date(momentInst.year(), curMonth, 1);
  var result = [];
  while (date.getMonth() === curMonth) {
    // date.getDay = index of ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      result.push(date);
    }
    date.setDate(date.getDate() + 1);
  }
  return result;
}

function getWorkDaysInMonths(invoices) {
  const invoicesPerMonth = groupInvoicesPerMonth(invoices);
  const result = invoicesPerMonth.map(({invoiceList}) => getWorkDaysInMonth(invoiceList[0].date).length);
  return result.reduce((prev, cur) => prev + cur, 0);
}


export function calculateDaysWorked(invoices) {
  const invoiceDays = invoices.map(daysCalc);
  const invoiceDayTotals = invoiceDays.reduce((a, b) => ({
    daysWorked: a.daysWorked + b.daysWorked,
    hoursWorked: a.hoursWorked + b.hoursWorked,
  }), {daysWorked: 0, hoursWorked: 0});


  const workDaysInMonth = getWorkDaysInMonths(invoices);
  return Object.assign(invoiceDayTotals, {workDaysInMonth});
}
