import moment from 'moment';
import InvoiceModel from '../models/InvoiceModel';
import { ClientModel } from '../../client/models/ClientModels';
import { InvoiceFilters, InvoiceFiltersSearch } from '../../../models';
import latinize from 'latinize';
import { searchClientFor } from '../../client/models/searchClientFor';
import { getMoney } from '../../controls';


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
    other: other,
  };
}


type TransformedInvoiceFilters = {
  directInvoiceNrs: number[],
  years: number[],
  clients: string[],
  other: string[],
}


export default class InvoiceListModel {
  invoices: InvoiceModel[];
  clients: ClientModel[];
  hasFilters: boolean;
  fs: TransformedInvoiceFilters;
  unverifiedOnly: boolean;
  isQuotation: boolean;

  constructor(invoices: InvoiceModel[], clients: ClientModel[], filters: InvoiceFilters, isQuotation: boolean) {
    this.invoices = invoices;
    this.clients = clients;
    this.hasFilters = !!filters.search.length;
    this.fs = transformFilters(filters.search, filters.freeInvoice);
    this.unverifiedOnly = filters.unverifiedOnly;
    this.isQuotation = isQuotation || false;
  }

  getFilterOptions() {
    var options: InvoiceFiltersSearch[] = [];

    // Add options: clients
    const manualFilteredInvoices = this.filterByDescription(this.invoices);
    const clientIds = manualFilteredInvoices.map(i => i.client._id);
    const relevantClients = this.clients.filter(c => clientIds.includes(c._id));
    options = options.concat(relevantClients.map(client => ({value: client._id, label: client.name, type: 'client'})));

    // Add options: years
    const invoiceYears = getInvoiceYears(manualFilteredInvoices);
    options = options.concat(invoiceYears.map(year => ({value: year, label: year, type: 'year'})));

    return options;
  }

  getFilteredInvoices(): InvoiceModel[] {
    const fs = this.fs;
    if (fs.directInvoiceNrs.length) {
      return this.invoices.filter(i => fs.directInvoiceNrs.includes(i.number));
    }

    var invoices = this.invoices;
    if (this.unverifiedOnly) {
      invoices = invoices.filter(i => !i.verified);
    }

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

  filterByDescription(invoices: InvoiceModel[]): InvoiceModel[] {
    this.fs.other.forEach(otherFilter => {
      const lastXMonths = otherFilter.match(/last (\d+) (.*)/);
      if (lastXMonths) {
        const amount = lastXMonths[1];
        const unit = lastXMonths[2];
        invoices = invoices.filter(i => i.date.isSameOrAfter(moment().startOf('day').subtract(amount, unit as any)));
        return;
      }
      invoices = invoices.filter(i => searchInvoiceFor(i, otherFilter));
    });

    return invoices;
  }
}


/**
 * Make a string ready for search
 */
export function searchinize(str: string): string {
  if (!str) {
    return '';
  }

  return latinize(str).trim().toLowerCase();
}


function searchInvoiceFor(invoice: InvoiceModel, text: string): boolean {
  text = searchinize(text);

  if (searchinize(invoice._id) === text) {
    return true;
  }

  if (invoice.number.toString().includes(text)) {
    return true;
  }

  if (searchinize(invoice.orderNr).includes(text)) {
    return true;
  }

  if (invoice.date.format('DD/MM/YYYY').startsWith(text)) {
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

  const money = invoice.money;
  const amounts = [money.discount, money.total, money.totalTax, money.totalWithoutTax];
  const amountUser = getMoney(text);
  if (amountUser && amounts.includes(amountUser)) {
    return true;
  }

  return false;
}


export function getInvoiceYears(invoices: InvoiceModel[]): number[] {
  const dates = invoices.map(i => i.date.toDate().valueOf());
  const firstInvoiceYear = moment(Math.min.apply(null, dates)).year();
  const lastInvoiceYear = moment(Math.max.apply(null, dates)).year();

  var years: number[] = [];
  for (let i = firstInvoiceYear; i <= lastInvoiceYear; i++) {
    years.push(i);
  }
  return years;
}
