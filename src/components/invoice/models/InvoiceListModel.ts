import moment from 'moment';
import InvoiceModel from './InvoiceModel';
import {ClientModel} from '../../client/models/ClientModels';
import {InvoiceFilters, InvoiceFiltersSearch} from '../../../models';
import {searchClientFor} from '../../client/models/searchClientFor';
import {t, searchinize, formatDate} from '../../utils';
import {getMoney} from '../../controls/form-controls/inputs/BasicMathInput';


function transformFilters(search: InvoiceFiltersSearch[], freeText: string): TransformedInvoiceFilters {
  const transformFn = (type: string) => search.filter(f => f.type === type).map(f => f.value);

  let other = transformFn('manual_input') as string[];
  if (freeText) {
    other = other.concat([freeText]);
  }

  return {
    directInvoiceNrs: transformFn('invoice-nr') as number[],
    years: transformFn('year') as number[],
    clients: transformFn('client') as string[],
    other,
  };
}


type TransformedInvoiceFilters = {
  directInvoiceNrs: number[],
  years: number[],
  clients: string[],
  other: string[],
}

/** Model used for filtering the InvoiceList */
export default class InvoiceListModel {
  invoices: InvoiceModel[];
  clients: ClientModel[];
  hasFilters: boolean;
  fs: TransformedInvoiceFilters;
  isQuotation: boolean;

  constructor(invoices: InvoiceModel[], clients: ClientModel[], filters: InvoiceFilters, isQuotation: boolean) {
    this.invoices = invoices;
    this.clients = clients;
    this.hasFilters = !!filters.search.length || !!filters.freeInvoice;
    this.fs = transformFilters(filters.search, filters.freeInvoice);
    this.isQuotation = isQuotation || false;
  }

  /** Get all Select.Creatable option suggestions */
  getFilterOptions(): InvoiceFiltersSearch[] {
    let options: InvoiceFiltersSearch[] = [
      {value: 'unverifiedOnly', label: t('invoice.notVerifiedOnly'), type: 'manual_input'},
      {value: 'from d/m/yyyy', label: 'from d/m/yyyy', type: 'manual_input'},
      {value: 'between d/m/yyyy and d/m/yyyy', label: 'between d/m/yyyy and d/m/yyyy', type: 'manual_input'},
      {value: 'last x days|months|years', label: 'last x days|months|years', type: 'manual_input'},
    ];

    const manualFilteredInvoices = this.filterByDescription(this.invoices);

    // Add options: years
    const invoiceYears = getInvoiceYears(manualFilteredInvoices).sort((a, b) => b - a);
    options = options.concat(invoiceYears.map(year => ({value: year, label: year, type: 'year'})));

    // Add options: clients
    const clientIds = this.invoices.map(i => i.client._id);
    const relevantClients = this.clients.filter(c => clientIds.includes(c._id));
    options = options.concat(relevantClients.map(client => ({value: client._id, label: client.name, type: 'client'})));

    return options;
  }

  /** Filter the invoices with the TransformedInvoiceFilters (what a bad idea that turned out to be) */
  getFilteredInvoices(): InvoiceModel[] {
    const {fs} = this;
    if (fs.directInvoiceNrs.length) {
      return this.invoices.filter(i => fs.directInvoiceNrs.includes(i.number));
    }

    let {invoices} = this;
    if (this.hasFilters) {
      if (fs.years.length) {
        invoices = invoices.filter(i => fs.years.includes(i.date.year()));
      }

      if (fs.clients.length) {
        invoices = invoices.filter(i => fs.clients.includes(i.client._id));
      }

      invoices = this.filterByDescription(invoices);
    }

    return invoices;
  }

  /**
   * Searches all common invoice fields
   * Plus some special searches: 'last x days', 'from 14/8/2019', 'unverifiedOnly', ...
   */
  private filterByDescription(input: InvoiceModel[]): InvoiceModel[] {
    let invoices = input;
    this.fs.other.forEach(otherFilter => {
      const lastXMonths = otherFilter.match(/last (\d+) (.*)/);
      if (lastXMonths) {
        const amount = lastXMonths[1];
        const unit = lastXMonths[2];
        invoices = invoices.filter(i => i.date.isSameOrAfter(moment().startOf('day').subtract(amount, unit as any)));
        return;
      }


      const from = otherFilter.match(/from (\d+\/\d+\/\d{4})/);
      if (from) {
        const date = moment(from[1], 'D/M/YYYY');
        invoices = invoices.filter(i => i.date.isSameOrAfter(date));
        return;
      }


      const between = otherFilter.match(/between (\d+\/\d+\/\d{4}) and (\d+\/\d+\/\d{4})/);
      if (between) {
        const start = moment(between[1], 'D/M/YYYY');
        const end = moment(between[2], 'D/M/YYYY');
        invoices = invoices.filter(i => i.date.isBetween(start, end));
        return;
      }


      if (otherFilter === 'unverifiedOnly') {
        invoices = invoices.filter(i => !i.verified);
        return;
      }

      invoices = invoices.filter(i => searchInvoiceFor(i, otherFilter));
    });

    return invoices;
  }
}

/** Search the invoice id, orderNr, date, client, amounts and lineDescs for text */
function searchInvoiceFor(invoice: InvoiceModel, input: string): boolean {
  const text = searchinize(input);

  if (searchinize(invoice._id) === text) {
    return true;
  }

  if (invoice.number.toString().includes(text)) {
    return true;
  }

  if (searchinize(invoice.orderNr).includes(text)) {
    return true;
  }

  if (formatDate(invoice.date).startsWith(text)) {
    return true;
  }

  if (searchClientFor(invoice.client, text)) {
    return true;
  }

  for (let i = 0; i < invoice.lines.length; i++) {
    const line = invoice.lines[i];
    if (searchinize(line.desc).includes(text)) {
      return true;
    }
  }

  const {money} = invoice;
  const amounts = [money.discount, money.total, money.totalTax, money.totalWithoutTax];
  const amountUser = getMoney(text);
  if (amountUser && amounts.includes(amountUser)) {
    return true;
  }

  return false;
}


/** Returns an array of years invoices were made in */
export function getInvoiceYears(invoices: InvoiceModel[]): number[] {
  const dates = invoices.map(i => i.date.toDate().valueOf());
  const firstInvoiceYear = moment(Math.min.apply(null, dates)).year();
  const lastInvoiceYear = moment(Math.max.apply(null, dates)).year();

  const years: number[] = [];
  for (let i = firstInvoiceYear; i <= lastInvoiceYear; i++) {
    years.push(i);
  }
  return years;
}
