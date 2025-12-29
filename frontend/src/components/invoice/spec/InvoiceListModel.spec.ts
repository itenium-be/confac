import moment from 'moment';
import InvoiceListModel from '../models/InvoiceListModel';
import InvoiceModel from '../models/InvoiceModel';
import {InvoiceListFilters} from '../../controls/table/table-models';


describe('InvoiceListModel', () => {
  it('filters with last x days', () => {
    const filters: InvoiceListFilters = {
      search: [{value: 'last 1 days', label: 'last 1 days', type: 'manual_input'}],
      groupedByMonth: false,
    } as InvoiceListFilters;
    const today = () => moment().startOf('day');
    const invoices = [
      {date: today(), status: 'Paid'} as InvoiceModel,
      {date: today().subtract(1, 'days'), status: 'Paid'} as InvoiceModel,
      {date: today().subtract(2, 'days'), status: 'Paid'} as InvoiceModel,
      {date: today().subtract(3, 'days'), status: 'Paid'} as InvoiceModel,
    ];
    const vm = new InvoiceListModel(invoices, [], [], filters, false);

    const result = vm.getFilteredInvoices();

    expect(result.length).toBe(2);
  });


  it('filters with last x days no longer shows unverified too', () => {
    const filters: InvoiceListFilters = {
      search: [{value: 'last 1 days', label: 'last 1 days', type: 'manual_input'}],
      groupedByMonth: false,
    } as InvoiceListFilters;
    const invoices = [
      {date: moment().subtract(3, 'days'), status: 'ToPay'} as InvoiceModel,
    ];
    const vm = new InvoiceListModel(invoices, [], [], filters, true);

    const result = vm.getFilteredInvoices();

    expect(result.length).toBe(0);
  });


  it('filters with free text in invoice lines', () => {
    const filters: InvoiceListFilters = {
      search: [{value: 'koen', label: 'koen', type: 'manual_input'}],
      groupedByMonth: false,
    } as InvoiceListFilters;

    const emptyClient = {
      city: '',
      street: '',
      streetNr: '',
      streetBox: '',
    };

    const invoices = [
      {_id: '', lines: [{desc: 'Prestaties Koen'}], client: emptyClient, orderNr: '', number: 5, date: moment(), money: {}} as InvoiceModel,
      {_id: '', lines: [{desc: 'Prestaties Ilse'}], client: emptyClient, orderNr: '', number: 6, date: moment(), money: {}} as InvoiceModel,
    ];
    const vm = new InvoiceListModel(invoices, [], [], filters, true);

    const result = vm.getFilteredInvoices();

    expect(result.length).toBe(1);
  });
});
