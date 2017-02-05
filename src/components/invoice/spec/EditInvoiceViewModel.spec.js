import moment from 'moment';
import {defaultConfig} from '../../../reducers.js';
import {getNewClient} from '../../client/EditClientViewModel.js';
import EditInvoiceViewModel, {calculateDaysWorked} from '../EditInvoiceViewModel.js';

//const defaultHoursInDay = 8;


function createViewModel(config) {
  config = config || defaultConfig;
  const client = getNewClient(config);
  var vm = EditInvoiceViewModel.createNew(config, client);
  vm.date = moment('2017-02-01'); // has 20 working days
  return vm;
}

describe('calculating money (taxes and totals)', () => {
  it('should have a total of 0 for no invoice lines', function() {
    var vm = createViewModel();
    expect(vm.money.total).toBe(0);
  });


  it('should have correct money values for daily/hourly invoice lines mixed', function() {
    var vm = createViewModel();
    vm.addLine({type: 'daily', amount: 1, tax: 21, price: 500});
    vm.addLine({type: 'hourly', amount: 1, tax: 21, price: 500});

    expect(vm.money).toEqual({
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

  it('calcs workDaysInMonth for multiple invoices in same month correctly', function() {
    var vm = createViewModel();
    vm.date = moment('2017-02-01'); // has 20 working days
    vm.addLine({type: 'hourly', amount: 8, tax: 21, price: 500});

    var vm2 = createViewModel();
    vm.date = moment('2017-02-01');
    vm2.addLine({type: 'daily', amount: 1, tax: 21, price: 500});

    var vm3 = createViewModel();
    vm.date = moment('2017-01-01'); // has 22 working days
    vm2.addLine({type: 'daily', amount: 1, tax: 21, price: 500});


    const result = calculateDaysWorked([vm, vm2, vm3]);


    expect(result.workDaysInMonth).toBe(20 + 22);
  });
});

