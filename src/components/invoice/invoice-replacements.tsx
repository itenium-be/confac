import moment from 'moment';
import {FullProjectMonthModel} from '../project/models/FullProjectMonthModel';
import InvoiceModel from './models/InvoiceModel';



export const invoiceReplacementsPopoverConfig = [
  {code: '{nr}', desc: 'config.invoiceReplacements.nr'},
  {code: '{nr:X}', desc: 'config.invoiceReplacements.nrX', defaultValue: '{nr:4}'},
  {code: '{date:FORMAT}', desc: 'config.invoiceReplacements.date', defaultValue: '{date:YYYY-MM}'},
  {code: '{orderNr}', desc: 'config.invoiceReplacements.orderNr'},
  {code: '{clientName}', desc: 'config.invoiceReplacements.clientName'},

  {code: '{projectMonth:FORMAT}', desc: 'config.invoiceReplacements.projectMonth', defaultValue: '{projectMonth:YYYY-MM}'},
  {code: '{consultantName}', desc: 'config.invoiceReplacements.consultantName'},
  // {code: '', desc: 'config.invoiceReplacements.'},
];



export function invoiceReplacements(input: string, invoice: InvoiceModel, fullProjectMonth?: FullProjectMonthModel): string {
  let str = input;

  const appLanguage = moment.locale();
  const clientLanguage = invoice.client.language;
  if (clientLanguage) {
    moment.locale(clientLanguage);
  }

  /** Need to wrap moment instances for the locale change to have effect */
  const clientFormat = (m: moment.Moment, format: string): string => moment(m.toDate()).format(format);

  const nrRegex = /\{nr:(\d+)\}/;
  const nrMatch = str.match(nrRegex);
  if (nrMatch) {
    const nrSize = Math.max(parseInt(nrMatch[1], 10), invoice.number.toString().length);
    str = str.replace(nrRegex, (`000000${invoice.number}`).slice(-nrSize));
  }

  str = str.replace(/\{nr\}/g, invoice.number.toString());

  const dateRegex = /\{date:([^}]+)\}/;
  const dateMatch = str.match(dateRegex);
  if (dateMatch && invoice.date) {
    const dateFormat = dateMatch[1];
    str = str.replace(dateRegex, clientFormat(invoice.date, dateFormat));
  }

  const projectMonthRegex = /\{projectMonth:([^}]+)\}/;
  const projectMonthMatch = str.match(projectMonthRegex);
  if (projectMonthMatch) {
    const dateFormat = projectMonthMatch[1];
    if (fullProjectMonth) {
      str = str.replace(projectMonthRegex, clientFormat(fullProjectMonth.details.month, dateFormat));
    } else {
      str = str.replace(projectMonthRegex, clientFormat(invoice.date, dateFormat));
    }
  }

  if (fullProjectMonth && str.indexOf('{consultantName}') !== -1) {
    str = str.replace('{consultantName}', `${fullProjectMonth.consultant.firstName} ${fullProjectMonth.consultant.name}`);
  } else {
    str = str.replace('{consultantName}', '???');
  }

  if (str.indexOf('{orderNr}') !== -1) {
    str = str.replace('{orderNr}', invoice.orderNr);
  }

  if (str.indexOf('{clientName}') !== -1) {
    str = str.replace('{clientName}', invoice.client.name);
  }

  // Object.keys(data).forEach(invoiceProp => {
  //   str = str.replace('{' + invoiceProp + '}', data[invoiceProp]);
  // });

  if (clientLanguage) {
    moment.locale(appLanguage);
  }

  return str;
}
