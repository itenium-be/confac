import InvoiceListModel from '../models/InvoiceListModel';
import moment from 'moment';
import InvoiceModel from '../models/InvoiceModel';
import { InvoiceFilters } from '../../../models';


describe('InvoiceListModel', () => {
  it('filters with last x days', () => {
    const filters: InvoiceFilters = {
      search: [{ value: 'last 1 days', label: 'last 1 days', type: 'manual_input' }],
      unverifiedOnly: false,
      groupedByMonth: false,
    } as InvoiceFilters;
    const today = () => moment().startOf('day');
    const invoices = [
      {date: today(), verified: true} as InvoiceModel,
      {date: today().subtract(1, 'days'), verified: true} as InvoiceModel,
      {date: today().subtract(2, 'days'), verified: true} as InvoiceModel,
      {date: today().subtract(3, 'days'), verified: true} as InvoiceModel,
    ];
    const vm = new InvoiceListModel(invoices, [], filters, false);

    const result = vm.getFilteredInvoices();

    expect(result.length).toBe(2);
  });


  it('filters with last x days also show all unverified', () => {
    const filters: InvoiceFilters = {
      search: [{ value: 'last 1 days', label: 'last 1 days', type: 'manual_input' }],
      unverifiedOnly: false,
      groupedByMonth: false,
    } as InvoiceFilters;
    const invoices = [
      {date: moment().subtract(3, 'days'), verified: false} as InvoiceModel,
    ];
    const vm = new InvoiceListModel(invoices, [], filters, true);

    const result = vm.getFilteredInvoices();

    expect(result.length).toBe(1);
  });


  it('filters with free text in invoice lines', () => {
    const filters: InvoiceFilters = {
      search: [{ value: 'koen', label: 'koen', type: 'manual_input' }],
      unverifiedOnly: false,
      groupedByMonth: false,
    } as InvoiceFilters;

    const emptyClient = {
      city: '',
      address: '',
    };

    const invoices = [
      {_id: '', lines: [{desc: 'Prestaties Koen'}], client: emptyClient, orderNr: '', number: 5, date: moment(), money: {}} as InvoiceModel,
      {_id: '', lines: [{ desc: 'Prestaties Ilse' }], client: emptyClient, orderNr: '', number: 6, date: moment(), money: {}} as InvoiceModel,
    ];
    const vm = new InvoiceListModel(invoices, [], filters, true);

    const result = vm.getFilteredInvoices();

    expect(result.length).toBe(1);
  });
});
