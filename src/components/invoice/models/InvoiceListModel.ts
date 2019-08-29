import moment from 'moment';
import EditInvoiceModel from './EditInvoiceModel';
import { ClientModel } from '../../client/models/ClientModels';
import { InvoiceFilters, InvoiceFiltersSearch } from '../../../models';
import { getMoney } from '../../controls';
import { searchClientFor } from "../../client/models/searchClientFor";

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
    invoiceLineDescs: transformFn('invoice_line') as string[],
    other: other,
  };
}


type TransformedInvoiceFilters = {
  directInvoiceNrs: number[],
  years: number[],
  clients: string[],
  invoiceLineDescs: string[],
  other: string[],
}


export default class InvoiceListModel {
  invoices: EditInvoiceModel[];
  clients: ClientModel[];
  hasFilters: boolean;
  fs: TransformedInvoiceFilters;
  unverifiedOnly: boolean;
  isQuotation: boolean;

  constructor(invoices: EditInvoiceModel[], clients: ClientModel[], filters: InvoiceFilters, isQuotation: boolean) {
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

    // Add options: unique invoice-line descriptions
    // ATTN: In comment, not particularly useful?
    //       (on delete: also delete other 'invoice_line' filtering)
    // const fullyFilteredInvoices = this.getFilteredInvoices();
    // const lines = fullyFilteredInvoices.map(i => i.lines);
    // const lineDescs = [].concat.apply([], lines).map(l => l.desc);
    // const uniqueLines = lineDescs.filter((desc, index, arr) => arr.indexOf(desc) === index);
    // options = options.concat(uniqueLines.map(lineDesc => ({value: lineDesc, label: lineDesc, type: 'invoice_line'})));

    return options;
  }

  getFilteredInvoices(): EditInvoiceModel[] {
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

  filterByDescription(invoices: EditInvoiceModel[]): EditInvoiceModel[] {
    // TODO: more invoiceLineDescs... Kill this?
    if (this.fs.invoiceLineDescs.length) {
      invoices = invoices.filter(i => this.fs.invoiceLineDescs.some(descFilter => i.lines.map(l => l.desc).includes(descFilter)));
    }

    this.fs.other.forEach(otherFilter => {
      const lastXMonths = otherFilter.match(/last (\d+) (.*)/);
      if (lastXMonths) {
        // ATTN: Last x months also shows all unverified invoices
        const amount = lastXMonths[1];
        const unit = lastXMonths[2];
        invoices = invoices.filter(i => !i.verified || i.date.isSameOrAfter(moment().startOf('day').subtract(amount, unit as any)));
        return;
      }
      invoices = invoices.filter(i => searchInvoiceFor(i, otherFilter));
    });

    return invoices;
  }
}





function searchInvoiceFor(invoice: EditInvoiceModel, text: string): boolean {
  text = text.toLowerCase().trim();

  if (invoice._id.toLowerCase() === text) {
    return true;
  }

  if (invoice.number.toString().includes(text)) {
    return true;
  }

  if (invoice.orderNr.toLowerCase().includes(text)) {
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
    if (line.desc.toLowerCase().includes(text)) {
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


export function getInvoiceYears(invoices: EditInvoiceModel[]): number[] {
  const dates = invoices.map(i => i.date.toDate().valueOf());
  const firstInvoiceYear = moment(Math.min.apply(null, dates)).year();
  const lastInvoiceYear = moment(Math.max.apply(null, dates)).year();

  var years: number[] = [];
  for (let i = firstInvoiceYear; i <= lastInvoiceYear; i++) {
    years.push(i);
  }
  return years;
}
