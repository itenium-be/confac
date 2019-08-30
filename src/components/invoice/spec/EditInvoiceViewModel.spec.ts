import moment from 'moment';
import { getNewClient } from "../../client/models/getNewClient";
import InvoiceModel, {calculateDaysWorked} from '../models/InvoiceModel';
import { defaultConfig } from '../../../reducers/default-states';
import { ConfigModel } from '../../config/models/ConfigModel';

//const defaultHoursInDay = 8;


function createViewModel(/*config?: ConfigModel*/) {
  // config = config || defaultConfig;
  const client = getNewClient(defaultConfig);
  var vm = InvoiceModel.createNew(defaultConfig, client);
  vm.date = moment('2017-02-01'); // has 20 working days
  return vm;
}

describe('calculating money (taxes and totals)', () => {
  it('should have a total of 0 for no invoice lines', function() {
    var vm = createViewModel();
    expect(vm.money.total).toBe(0);
  });


  it('should ignore "section" lines', function() {
    var vm = createViewModel();
    vm.addLine({type: 'section', amount: 1, tax: 21, price: 500, desc: '', sort: 0});
    expect(vm.money.total).toEqual(0);
  });


  it('should have correct money values for daily/hourly invoice lines mixed', function() {
    var vm = createViewModel();
    vm.addLine({type: 'daily', amount: 1, tax: 21, price: 500, desc: '', sort: 0});
    vm.addLine({type: 'hourly', amount: 1, tax: 21, price: 500, desc: '', sort: 0});

    expect(vm.money).toEqual({
      totalWithoutTax: 1000,
      totalTax: 210,
      discount: 0,
      total: 1210,
      totals: jasmine.any(Object),
    });
  });


  describe('discounts', function() {
    it('should use a fixed amount when the discount is a number', function() {
      var vm = createViewModel();
      vm.discount = '200';
      vm.addLine({type: 'daily', amount: 1, tax: 10, price: 500, desc: '', sort: 0});

      expect(vm.money).toEqual({
        totalWithoutTax: 500,
        totalTax: 50,
        discount: 200,
        total: 350,
        totals: jasmine.any(Object),
      });
    });

    it('should use a percentage when the discount ends with the % sign', function() {
      var vm = createViewModel();
      vm.discount = '10%';
      vm.addLine({type: 'daily', amount: 1, tax: 10, price: 500, desc: '', sort: 0});

      expect(vm.money).toEqual({
        totalWithoutTax: 500,
        totalTax: 50,
        discount: '10%',
        total: 495,
        totals: jasmine.any(Object),
      });
    });
  });


  describe('totals per line.type', function() {
    it('should calculate total without tax for each line.type', function() {
      var vm = createViewModel();
      vm.addLine({type: 'daily', amount: 1, tax: 0, price: 500, desc: '', sort: 0});
      vm.addLine({type: 'hourly', amount: 2, tax: 10, price: 500, desc: '', sort: 0});

      expect(vm.money.totals).toEqual({
        daily: 500,
        hourly: 1000,
      });
    });
  });
});



describe('calculating days worked', () => {
  it('calcs 2 hourly lines correctly', function() {
    var vm = createViewModel();
    vm.addLine({type: 'hourly', amount: 8, tax: 21, price: 500, desc: '', sort: 0});
    vm.addLine({type: 'hourly', amount: 8, tax: 21, price: 500, desc: '', sort: 0});
    const result = calculateDaysWorked([vm]);

    expect(result).toEqual({
      daysWorked: 2,
      workDaysInMonth: 20,
      hoursWorked: 16,
    });
  });

  it('calcs 2 daily lines correctly', function() {
    var vm = createViewModel();
    vm.addLine({type: 'daily', amount: 1, tax: 21, price: 500, desc: '', sort: 0});
    vm.addLine({type: 'daily', amount: 1, tax: 21, price: 500, desc: '', sort: 0});
    const result = calculateDaysWorked([vm]);

    expect(result).toEqual({
      daysWorked: 2,
      workDaysInMonth: 20,
      hoursWorked: 16,
    });
  });

  it('calcs days and hours mixed correctly', function() {
    var vm = createViewModel();
    vm.addLine({type: 'hourly', amount: 8, tax: 21, price: 500, desc: '', sort: 0});
    vm.addLine({type: 'daily', amount: 1, tax: 21, price: 500, desc: '', sort: 0});
    const result = calculateDaysWorked([vm]);

    expect(result).toEqual({
      daysWorked: 2,
      workDaysInMonth: 20,
      hoursWorked: 16,
    });
  });

  it('calcs workDaysInMonth for multiple invoices in same month correctly', function() {
    var vm = createViewModel();
    vm.date = moment('2017-02-01'); // has 20 working days
    vm.addLine({type: 'hourly', amount: 8, tax: 21, price: 500, desc: '', sort: 0});

    var vm2 = createViewModel();
    vm.date = moment('2017-02-01');
    vm2.addLine({type: 'daily', amount: 1, tax: 21, price: 500, desc: '', sort: 0});

    var vm3 = createViewModel();
    vm.date = moment('2017-01-01'); // has 22 working days
    vm2.addLine({type: 'daily', amount: 1, tax: 21, price: 500, desc: '', sort: 0});


    const result = calculateDaysWorked([vm, vm2, vm3]);


    expect(result.workDaysInMonth).toBe(20 + 22);
  });
});


describe('Switch between days and hours', function() {
  it('Fixes price & amount when switching from daily to hourly', function() {
    var vm = createViewModel();
    vm.updateLine(0, { type: 'daily', amount: 1, price: 800 });

    vm.updateLine(0, { type: 'hourly' });

    expect(vm.lines[0].type).toBe('hourly');
    expect(vm.lines[0].price).toBe(100);
    expect(vm.lines[0].amount).toBe(8);
  });

  it('Fixes price & amount when switching from hourly to daily', function () {
    var vm = createViewModel();
    vm.updateLine(0, { type: 'hourly' });
    vm.updateLine(0, { amount: 8, price: 100 });

    vm.updateLine(0, { type: 'daily' });

    expect(vm.lines[0].type).toBe('daily');
    expect(vm.lines[0].price).toBe(800);
    expect(vm.lines[0].amount).toBe(1);
  });

  it('Takes the client rate.hoursInDay into account', function () {
    var vm = createViewModel();
    vm.client.rate.hoursInDay = 10;
    vm.updateLine(0, { type: 'daily', amount: 1 });

    vm.updateLine(0, { type: 'hourly' });

    expect(vm.lines[0].amount).toBe(10);
  });
});
