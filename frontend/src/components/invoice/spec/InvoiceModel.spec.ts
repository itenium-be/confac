import {vi} from 'vitest';
import moment from 'moment';
import {getNewClient} from '../../client/models/getNewClient';
import InvoiceModel, {calculateDaysWorked, calculatePaymentReference, getWorkDaysInMonths} from '../models/InvoiceModel';
import {defaultConfig} from '../../config/models/getNewConfig';
import {ConfigModel} from '../../config/models/ConfigModel';
import {ClientModel} from '../../client/models/ClientModels';
import {InvoiceLineActions} from '../models/InvoiceLineModels';
import {InvoiceDateStrategy} from '../../../models';

// const DefaultHoursInDay = 8;

function createNew(config: ConfigModel, client: undefined | ClientModel): InvoiceModel {
  let model = new InvoiceModel(config, {
    client,
    number: 1,
    fileName: client ? client.invoiceFileName : '',
  });
  model = model.setClient(client);
  return model;
}


function createViewModel() {
  const client = getNewClient(defaultConfig);
  const vm = createNew(defaultConfig, client);
  vm.date = moment('2017-02-01'); // has 20 working days
  return vm;
}

describe('calculating money (taxes and totals)', () => {
  it('should have a total of 0 for no invoice lines', () => {
    const vm = createViewModel();
    expect(vm.money.total).toBe(0);
  });


  it('should ignore "section" lines', () => {
    const vm = createViewModel();
    vm.setLines([{type: 'section', amount: 1, tax: 21, price: 500, desc: '', sort: 0}]);
    expect(vm.money.total).toEqual(0);
  });


  it('should have correct money values for daily/hourly invoice lines mixed', () => {
    const vm = createViewModel();
    vm.setLines([
      {type: 'daily', amount: 1, tax: 21, price: 500, desc: '', sort: 0},
      {type: 'hourly', amount: 1, tax: 21, price: 500, desc: '', sort: 0},
    ]);

    expect(vm.money).toEqual({
      totalWithoutTax: 1000,
      totalTax: 210,
      discount: 0,
      total: 1210,
      totals: expect.any(Object),
    });
  });


  describe('discounts', () => {
    it('should use a fixed amount when the discount is a number', () => {
      const vm = createViewModel();
      vm.discount = '200';
      vm.setLines([{type: 'daily', amount: 1, tax: 10, price: 500, desc: '', sort: 0}]);

      expect(vm.money).toEqual({
        totalWithoutTax: 500,
        totalTax: 50,
        discount: 200,
        total: 350,
        totals: expect.any(Object),
      });
    });

    it('should use a percentage when the discount ends with the % sign', () => {
      const vm = createViewModel();
      vm.discount = '10%';
      vm.setLines([{type: 'daily', amount: 1, tax: 10, price: 500, desc: '', sort: 0}]);

      expect(vm.money).toEqual({
        totalWithoutTax: 500,
        totalTax: 50,
        discount: '10%',
        total: 495,
        totals: expect.any(Object),
      });
    });
  });


  describe('totals per line.type', () => {
    it('should calculate total without tax for each line.type', () => {
      const vm = createViewModel();
      vm.setLines([
        {type: 'daily', amount: 1, tax: 0, price: 500, desc: '', sort: 0},
        {type: 'hourly', amount: 2, tax: 10, price: 500, desc: '', sort: 0},
      ]);

      expect(vm.money.totals).toEqual({
        daily: 500,
        hourly: 1000,
      });
    });

    it('should match totalWithoutTax when summing all line types', () => {
      const vm = createViewModel();
      vm.setLines([
        {type: 'daily', amount: 1.5, tax: 21, price: 100.555, desc: '', sort: 0},
        {type: 'hourly', amount: 2.3, tax: 6, price: 50.445, desc: '', sort: 0},
        {type: 'other', amount: 1, tax: 0, price: 25.999, desc: '', sort: 0},
      ]);

      // Verify that summing all totals per type equals totalWithoutTax
      const sumOfTotals = Object.values(vm.money.totals).reduce((a, b) => a + b, 0);
      expect(sumOfTotals).toBe(vm.money.totalWithoutTax);
    });

    it('should ignore section lines in totals per type', () => {
      const vm = createViewModel();
      vm.setLines([
        {type: 'section', amount: 999, tax: 21, price: 999, desc: '', sort: 0},
        {type: 'daily', amount: 1, tax: 21, price: 100, desc: '', sort: 0},
        {type: 'hourly', amount: 2, tax: 21, price: 50, desc: '', sort: 0},
      ]);

      expect(vm.money.totals).toEqual({
        daily: 100,
        hourly: 100,
      });
    });
  });


  describe('rounding order line totals', () => {
    it('should round line totals to 2 decimal places', () => {
      const vm = createViewModel();
      vm.setLines([
        {type: 'daily', amount: 1.5, tax: 21, price: 333.33, desc: '', sort: 0},
      ]);

      // 1.5 * 333.33 = 499.995, should round to 500.00
      expect(vm.money.totalWithoutTax).toBe(500);
      expect(vm.money.totalTax).toBe(105); // 500 * 0.21 = 105
      expect(vm.money.total).toBe(605);
    });

    it('should round down when value is below .5', () => {
      const vm = createViewModel();
      vm.setLines([
        {type: 'daily', amount: 1, tax: 21, price: 100.444, desc: '', sort: 0},
      ]);

      // 1 * 100.444 = 100.444, should round to 100.44
      expect(vm.money.totalWithoutTax).toBe(100.44);
      // Tax is calculated on rounded line total: 100.44 * 0.21 = 21.0924 (not rounded in totalTax)
      expect(vm.money.totalTax).toBeCloseTo(21.09, 2);
      expect(vm.money.total).toBe(121.53);
    });

    it('should round up when value is at or above .5', () => {
      const vm = createViewModel();
      vm.setLines([
        {type: 'daily', amount: 1, tax: 21, price: 100.445, desc: '', sort: 0},
      ]);

      // 1 * 100.445 = 100.445, should round to 100.45
      expect(vm.money.totalWithoutTax).toBe(100.45);
      // Tax is calculated on rounded line total: 100.45 * 0.21 = 21.0945 (not rounded in totalTax)
      expect(vm.money.totalTax).toBeCloseTo(21.09, 2);
      expect(vm.money.total).toBe(121.54);
    });

    it('should round each line independently before summing', () => {
      const vm = createViewModel();
      vm.setLines([
        {type: 'daily', amount: 1, tax: 21, price: 100.445, desc: '', sort: 0},
        {type: 'daily', amount: 1, tax: 21, price: 200.446, desc: '', sort: 0},
      ]);

      // Line 1: 1 * 100.445 = 100.445, rounds to 100.45
      // Line 2: 1 * 200.446 = 200.446, rounds to 200.45
      // Total without tax: 100.45 + 200.45 = 300.90
      expect(vm.money.totalWithoutTax).toBe(300.90);
      // Tax: (100.45 * 0.21) + (200.45 * 0.21) = 21.0945 + 42.0945 = 63.189
      expect(vm.money.totalTax).toBeCloseTo(63.19, 2);
      expect(vm.money.total).toBe(364.09);
    });

    it('should round final total after discount is applied', () => {
      const vm = createViewModel();
      vm.discount = '10%';
      vm.setLines([
        {type: 'daily', amount: 1, tax: 21, price: 100.33, desc: '', sort: 0},
      ]);

      // Line: 1 * 100.33 = 100.33
      // Tax: 100.33 * 0.21 = 21.0693
      // Total before discount: 100.33 + 21.0693 = 121.3993
      // After 10% discount: 121.3993 * 0.9 = 109.25937
      // Should round to 109.26
      expect(vm.money.total).toBe(109.26);
    });

    it('should handle multiple lines with different tax rates', () => {
      const vm = createViewModel();
      vm.setLines([
        {type: 'daily', amount: 1.5, tax: 21, price: 100.555, desc: '', sort: 0},
        {type: 'hourly', amount: 2.3, tax: 6, price: 50.445, desc: '', sort: 0},
      ]);

      // Line 1: 1.5 * 100.555 = 150.8325, rounds to 150.83
      // Line 2: 2.3 * 50.445 = 116.0235, rounds to 116.02
      // Total without tax: 150.83 + 116.02 = 266.85
      expect(vm.money.totalWithoutTax).toBe(266.85);

      // Billit method: round each tax group's total
      // 21% group: 150.83 * 1.21 = 182.5043, rounds to 182.50
      // 6% group: 116.02 * 1.06 = 122.9812, rounds to 122.98
      // Total: 182.50 + 122.98 = 305.48
      // Total tax: 305.48 - 266.85 = 38.63
      expect(vm.money.totalTax).toBe(38.63);
      expect(vm.money.total).toBe(305.48);
    });

    it('should handle very small amounts that round to zero', () => {
      const vm = createViewModel();
      vm.setLines([
        {type: 'daily', amount: 0.001, tax: 21, price: 1, desc: '', sort: 0},
      ]);

      // 0.001 * 1 = 0.001, rounds to 0.00
      expect(vm.money.totalWithoutTax).toBe(0);
      expect(vm.money.totalTax).toBe(0);
      expect(vm.money.total).toBe(0);
    });

    it('should handle edge case with 0.005 rounding', () => {
      const vm = createViewModel();
      vm.setLines([
        {type: 'daily', amount: 1, tax: 0, price: 1.005, desc: '', sort: 0},
      ]);

      // 1 * 1.005 = 1.005, should round to 1.01 (round half away from zero)
      expect(vm.money.totalWithoutTax).toBe(1.01);
    });
  });

  describe('tax calculation using Billit method', () => {
    it('should group lines by tax rate before calculating tax', () => {
      const vm = createViewModel();
      vm.setLines([
        {type: 'daily', amount: 1, tax: 21, price: 100, desc: '', sort: 0},
        {type: 'daily', amount: 1, tax: 21, price: 200, desc: '', sort: 0},
        {type: 'hourly', amount: 1, tax: 6, price: 50, desc: '', sort: 0},
      ]);

      // 21% group: 100 + 200 = 300, tax = 300 * 0.21 = 63
      // 6% group: 50, tax = 50 * 0.06 = 3
      // Total tax: 63 + 3 = 66
      expect(vm.money.totalWithoutTax).toBe(350);
      expect(vm.money.totalTax).toBe(66);
      expect(vm.money.total).toBe(416);
    });

    it('should minimize rounding errors compared to per-line tax calculation', () => {
      const vm = createViewModel();
      vm.setLines([
        {type: 'daily', amount: 1, tax: 21, price: 49.99, desc: '', sort: 0},
        {type: 'daily', amount: 1, tax: 21, price: 24.95, desc: '', sort: 0},
        {type: 'daily', amount: 1, tax: 21, price: 59.99, desc: '', sort: 0},
      ]);

      // Using Billit method (group by tax rate):
      // 21% group: 49.99 + 24.95 + 59.99 = 134.93
      // Tax: 134.93 * 0.21 = 28.3353
      // Total tax: 28.3353 (not rounded in totalTax field)
      expect(vm.money.totalWithoutTax).toBe(134.93);
      expect(vm.money.totalTax).toBeCloseTo(28.34, 2);
      expect(vm.money.total).toBe(163.27);
    });

    it('should handle multiple tax groups with rounding', () => {
      const vm = createViewModel();
      vm.setLines([
        {type: 'daily', amount: 1.5, tax: 21, price: 100.555, desc: '', sort: 0},
        {type: 'daily', amount: 1, tax: 21, price: 50.445, desc: '', sort: 0},
        {type: 'hourly', amount: 2.3, tax: 6, price: 50.445, desc: '', sort: 0},
        {type: 'hourly', amount: 1, tax: 6, price: 25.555, desc: '', sort: 0},
      ]);

      // Line 1: 1.5 * 100.555 = 150.8325, rounds to 150.83
      // Line 2: 1 * 50.445 = 50.445, rounds to 50.45 (rounds up due to epsilon)
      // Line 3: 2.3 * 50.445 = 116.0235, rounds to 116.02
      // Line 4: 1 * 25.555 = 25.555, rounds to 25.56 (rounds up due to epsilon)

      // Billit method: round each tax group's total
      // 21% group subtotal: 150.83 + 50.45 = 201.28
      // 21% group total with tax: 201.28 * 1.21 = 243.5488, rounds to 243.55
      // 6% group subtotal: 116.02 + 25.56 = 141.58
      // 6% group total with tax: 141.58 * 1.06 = 150.0748, rounds to 150.07
      // Total: 243.55 + 150.07 = 393.62
      // Total without tax: 201.28 + 141.58 = 342.86
      // Total tax: 393.62 - 342.86 = 50.76
      expect(vm.money.totalWithoutTax).toBe(342.86);
      expect(vm.money.totalTax).toBe(50.76);
      expect(vm.money.total).toBe(393.62);
    });

    it('should handle single line per tax rate with group rounding', () => {
      const vm = createViewModel();
      vm.setLines([
        {type: 'daily', amount: 1.5, tax: 21, price: 100.555, desc: '', sort: 0},
        {type: 'hourly', amount: 2.3, tax: 6, price: 50.445, desc: '', sort: 0},
      ]);

      // Line 1: 1.5 * 100.555 = 150.8325, rounds to 150.83
      // Line 2: 2.3 * 50.445 = 116.0235, rounds to 116.02
      // Billit method: round each tax group's total
      // 21% group: 150.83 * 1.21 = 182.5043, rounds to 182.50
      // 6% group: 116.02 * 1.06 = 122.9812, rounds to 122.98
      // Total: 182.50 + 122.98 = 305.48
      // Total tax: 305.48 - 266.85 = 38.63
      expect(vm.money.totalWithoutTax).toBe(266.85);
      expect(vm.money.totalTax).toBe(38.63);
      expect(vm.money.total).toBe(305.48);
    });

    it('should calculate tax on 0% tax rate (no tax)', () => {
      const vm = createViewModel();
      vm.setLines([
        {type: 'daily', amount: 1, tax: 0, price: 100, desc: '', sort: 0},
        {type: 'daily', amount: 1, tax: 0, price: 200, desc: '', sort: 0},
      ]);

      // 0% group: 100 + 200 = 300, tax = 300 * 0 = 0
      expect(vm.money.totalWithoutTax).toBe(300);
      expect(vm.money.totalTax).toBe(0);
      expect(vm.money.total).toBe(300);
    });
  });
});



describe('calculating days worked', () => {
  it('calcs 2 hourly lines correctly', () => {
    const vm = createViewModel();
    vm.setLines([
      {type: 'hourly', amount: 8, tax: 21, price: 500, desc: '', sort: 0},
      {type: 'hourly', amount: 8, tax: 21, price: 500, desc: '', sort: 0},
    ]);
    const result = calculateDaysWorked([vm]);

    expect(result).toEqual({
      daysWorked: 2,
      hoursWorked: 16
    });
  });

  it('calcs 2 daily lines correctly', () => {
    const vm = createViewModel();
    vm.setLines([
      {type: 'daily', amount: 1, tax: 21, price: 500, desc: '', sort: 0},
      {type: 'daily', amount: 1, tax: 21, price: 500, desc: '', sort: 0},
    ]);
    const result = calculateDaysWorked([vm]);

    expect(result).toEqual({
      daysWorked: 2,
      hoursWorked: 16
    });
  });

  it('calcs days and hours mixed correctly', () => {
    const vm = createViewModel();
    vm.setLines([
      {type: 'hourly', amount: 8, tax: 21, price: 500, desc: '', sort: 0},
      {type: 'daily', amount: 1, tax: 21, price: 500, desc: '', sort: 0},
    ]);
    const result = calculateDaysWorked([vm]);

    expect(result).toEqual({
      daysWorked: 2,
      hoursWorked: 16
    });
  });

  it('calcs workDaysInMonth for multiple invoices in same month correctly', () => {
    const vm = createViewModel();
    vm.date = moment('2017-02-01'); // has 20 working days
    vm.setLines([{type: 'hourly', amount: 8, tax: 21, price: 500, desc: '', sort: 0}]);

    const vm2 = createViewModel();
    vm.date = moment('2017-02-01');
    vm2.setLines([{type: 'daily', amount: 1, tax: 21, price: 500, desc: '', sort: 0}]);

    const vm3 = createViewModel();
    vm.date = moment('2017-01-01'); // has 22 working days
    vm3.setLines([{type: 'daily', amount: 1, tax: 21, price: 500, desc: '', sort: 0}]);


    const workDaysInMonth = getWorkDaysInMonths([vm, vm2, vm3]);


    expect(workDaysInMonth).toBe(20 + 22);
  });
});


describe('Switch between days and hours', () => {
  it('Fixes price & amount when switching from daily to hourly', () => {
    const vm = createViewModel();
    let lines = InvoiceLineActions.updateLine(vm.lines, 0, {type: 'daily', amount: 1, price: 800}, vm);

    lines = InvoiceLineActions.updateLine(lines, 0, {type: 'hourly'}, vm);
    vm.setLines(lines);

    expect(vm.lines[0].type).toBe('hourly');
    expect(vm.lines[0].price).toBe(100);
    expect(vm.lines[0].amount).toBe(8);
  });

  it('Fixes price & amount when switching from hourly to daily', () => {
    const vm = createViewModel();
    let lines = InvoiceLineActions.updateLine(vm.lines, 0, {type: 'hourly'}, vm);
    lines = InvoiceLineActions.updateLine(lines, 0, {amount: 8, price: 100}, vm);

    lines = InvoiceLineActions.updateLine(lines, 0, {type: 'daily'}, vm);
    vm.setLines(lines);

    expect(vm.lines[0].type).toBe('daily');
    expect(vm.lines[0].price).toBe(800);
    expect(vm.lines[0].amount).toBe(1);
  });

  it('Takes the client rate.hoursInDay into account', () => {
    const vm = createViewModel();
    vm.client.hoursInDay = 10;
    let lines = InvoiceLineActions.updateLine(vm.lines, 0, {type: 'daily', amount: 1, price: 100}, vm);

    lines = InvoiceLineActions.updateLine(lines, 0, {type: 'hourly'}, vm);
    vm.setLines(lines);

    expect(vm.lines[0].amount).toBe(10);
  });
});


function createViewModelWithDateStrategy(strat: InvoiceDateStrategy) {
  const config = {...defaultConfig, defaultInvoiceDateStrategy: strat};
  const client = getNewClient(config);
  const vm = createNew(config, client);
  vm.date = moment('2017-02-01'); // has 20 working days
  return vm;
}


describe('Invoice date new month from the 22th', () => {
  it('Should be 31 may when date is 10 june', () => {
    const vm = createViewModelWithDateStrategy('new-month-from-22th');
    Date.now = vi.fn().mockReturnValue(new Date('2024-06-10T00:00:00.000Z'));
    vm.setClient(undefined);

    expect(vm.date.format('YYYY-MM-DD')).toBe('2024-05-31');
  });

  it('Should be 31 december when date is 10 januari', () => {
    const vm = createViewModelWithDateStrategy('new-month-from-22th');
    Date.now = vi.fn().mockReturnValue(new Date('2024-01-10T00:00:00.000Z'));
    vm.setClient(undefined);

    expect(vm.date.format('YYYY-MM-DD')).toBe('2023-12-31');
  });

  it('Should be 30 june month when date is 30 june', () => {
    const vm = createViewModelWithDateStrategy('new-month-from-22th');
    Date.now = vi.fn().mockReturnValue(new Date('2024-06-30T00:00:00.000Z'));
    vm.setClient(undefined);

    expect(vm.date.format('YYYY-MM-DD')).toBe('2024-06-30');
  });

  it('Should be 29 februari month when date is 29 februari', () => {
    const vm = createViewModelWithDateStrategy('new-month-from-22th');
    Date.now = vi.fn().mockReturnValue(new Date('2024-02-29T00:00:00.000Z'));
    vm.setClient(undefined);

    expect(vm.date.format('YYYY-MM-DD')).toBe('2024-02-29');
  });

  it('Should be 31 januari month when date is 31 januari', () => {
    const vm = createViewModelWithDateStrategy('new-month-from-22th');
    Date.now = vi.fn().mockReturnValue(new Date('2024-01-31T00:00:00.000Z'));
    vm.setClient(undefined);

    expect(vm.date.format('YYYY-MM-DD')).toBe('2024-01-31');
  });

  it('Should be 1 june month when date is 22 june', () => {
    const vm = createViewModelWithDateStrategy('new-month-from-22th');
    Date.now = vi.fn().mockReturnValue(new Date('2024-06-22T00:00:00.000Z'));
    vm.setClient(undefined);

    expect(vm.date.format('YYYY-MM-DD')).toBe('2024-06-01');
  });

  it('Should be 1 januari month when date is 22 januari', () => {
    const vm = createViewModelWithDateStrategy('new-month-from-22th');
    Date.now = vi.fn().mockReturnValue(new Date('2024-01-22T00:00:00.000Z'));
    vm.setClient(undefined);

    expect(vm.date.format('YYYY-MM-DD')).toBe('2024-01-01');
  });
});

describe('calculatePaymentReference', () => {
  describe('without projectMonth', () => {
    it('should use 000 for YMM when no projectMonth', () => {
      const result = calculatePaymentReference(1, undefined);
      expect(result).toMatch(/^\+\+\+000\//);
    });

    it('should calculate correct reference for invoice number 1', () => {
      const result = calculatePaymentReference(1, undefined);
      expect(result).toBe('+++000/0001/0003+++');
    });

    it('should calculate correct reference for invoice number 9999', () => {
      const result = calculatePaymentReference(9999, undefined);
      expect(result).toBe('+++000/9999/0024+++');
    });
  });

  describe('with projectMonth', () => {
    it('should use YMM from projectMonth (January 2024)', () => {
      const projectMonth = moment('2024-01-15');
      const result = calculatePaymentReference(1, projectMonth);
      expect(result).toMatch(/^\+\+\+401\//);
    });

    it('should calculate correct reference for invoice 42 in March 2024', () => {
      const projectMonth = moment('2024-03-15');
      const result = calculatePaymentReference(42, projectMonth);
      expect(result).toBe('+++403/0042/0046+++');
    });
  });

  describe('invoice number overflow (>9999)', () => {
    it('should handle invoice number 10000', () => {
      const result = calculatePaymentReference(10000, undefined);
      expect(result).toBe('+++000/1000/0090+++');
    });

    it('should handle invoice number 12345', () => {
      const result = calculatePaymentReference(12345, undefined);
      expect(result).toBe('+++000/1234/5066+++');
    });

    it('should handle large invoice number with projectMonth', () => {
      const projectMonth = moment('2024-06-15');
      const result = calculatePaymentReference(15678, projectMonth);
      expect(result).toBe('+++406/1567/8029+++');
    });

    it('should handle invoice number 123456', () => {
      const result = calculatePaymentReference(123456, undefined);
      expect(result).toBe('+++000/1234/5672+++');
    });
  });

  describe('mod 97 edge cases', () => {
    it('should use 97 when mod 97 result is 0', () => {
      const result = calculatePaymentReference(97, undefined);
      expect(result).toBe('+++000/0097/0097+++');
    });
  });
});
