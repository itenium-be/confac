import InvoiceListViewModel from '../InvoiceListViewModel';
import moment from 'moment';


describe('InvoiceListViewModel', () => {
  it('filters with last x days', () => {
    const filters = {
      search: [{ value: 'last 1 days', label: 'last 1 days', type: 'manual_input' }],
      unverifiedOnly: false,
      groupedByMonth: false,
    };
    const today = () => moment().startOf('day');
    const invoices = [
      {date: today(), verified: true},
      {date: today().subtract(1, 'days'), verified: true},
      {date: today().subtract(2, 'days'), verified: true},
      {date: today().subtract(3, 'days'), verified: true},
    ];
    const vm = new InvoiceListViewModel(invoices, [], filters);

    const result = vm.getFilteredInvoices();

    expect(result.length).toBe(2);
  });


  it('filters with last x days also show all unverified', () => {
    const filters = {
      search: [{ value: 'last 1 days', label: 'last 1 days', type: 'manual_input' }],
      unverifiedOnly: false,
      groupedByMonth: false,
    };
    const invoices = [
      {date: moment().subtract(3, 'days'), verified: false},
    ];
    const vm = new InvoiceListViewModel(invoices, [], filters);

    const result = vm.getFilteredInvoices();

    expect(result.length).toBe(1);
  });


  it('filters with free text in invoice lines', () => {
    const filters = {
      search: [{ value: 'koen', label: 'koen', type: 'manual_input' }],
      unverifiedOnly: false,
      groupedByMonth: false,
    };

    const emptyClient = {
      city: '',
      address: '',
    };

    const invoices = [
      {lines: [{desc: 'Prestaties Koen'}], client: emptyClient, orderNr: ''},
      {lines: [{ desc: 'Prestaties Ilse' }], client: emptyClient, orderNr: ''},
    ];
    const vm = new InvoiceListViewModel(invoices, [], filters);

    const result = vm.getFilteredInvoices();

    expect(result.length).toBe(1);
  });
});
