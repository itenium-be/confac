import moment from 'moment';
import {defaultConfig} from '../../../reducers.js';
import {getNewClient} from '../../client/EditClientViewModel.js';
import EditInvoiceViewModel, {calculateDaysWorked} from '../EditInvoiceViewModel.js';

//const defaultHoursInDay = 8;


function createViewModel(config) {
  config = config || defaultConfig;
  const client = getNewClient(config);
  var vm = EditInvoiceViewModel.createNew(config, client);
  vm.date = moment('2017-02-04');
  return vm;
}

describe('no lines', () => {
  beforeEach(function() {
    this.vm = createViewModel();
  });

  it('should have a total of 0', function() {
    expect(this.vm.money.total).toBe(0);
  });
});

describe('calculating taxes and totals', () => {
  beforeEach(function() {
    this.vm = createViewModel();
    this.vm.addLine({type: 'daily', amount: 1, tax: 21, price: 500});
    this.vm.addLine({type: 'hourly', amount: 1, tax: 21, price: 500});
  });

  it('should have correct values', function() {
    expect(this.vm.money).toEqual({
      total: 1210,
      totalTax: 210,
      totalWithoutTax: 1000,
    });
  });
});

describe('calculating days worked', () => {
  it('calcs 2 hourly lines correctly', function() {
    var vm = createViewModel();
    vm.addLine({type: 'hourly', amount: 8, tax: 21, price: 500});
    vm.addLine({type: 'hourly', amount: 8, tax: 21, price: 500});
    const result = calculateDaysWorked([vm]);

    expect(result).toEqual({
      daysWorked: 2,
      workDaysInMonth: 20,
      hoursWorked: 16,
    });
  });

  it('calcs 2 daily lines correctly', function() {
    var vm = createViewModel();
    vm.addLine({type: 'daily', amount: 1, tax: 21, price: 500});
    vm.addLine({type: 'daily', amount: 1, tax: 21, price: 500});
    const result = calculateDaysWorked([vm]);

    expect(result).toEqual({
      daysWorked: 2,
      workDaysInMonth: 20,
      hoursWorked: 16,
    });
  });

  it('calcs days and hours mixed correctly', function() {
    var vm = createViewModel();
    vm.addLine({type: 'hourly', amount: 8, tax: 21, price: 500});
    vm.addLine({type: 'daily', amount: 1, tax: 21, price: 500});
    const result = calculateDaysWorked([vm]);

    expect(result).toEqual({
      daysWorked: 2,
      workDaysInMonth: 20,
      hoursWorked: 16,
    });
  });
});

