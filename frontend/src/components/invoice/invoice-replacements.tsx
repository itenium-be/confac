import moment from 'moment';
import InvoiceModel from './models/InvoiceModel';
import {t} from '../utils';



export interface ITextEditorCustomReplacement {
  code: string;
  desc: string;
  defaultValue?: string;
}


export const invoiceReplacementsPopoverConfig: ITextEditorCustomReplacement[] = [
  {code: '{nr}', desc: 'config.invoiceReplacements.nr'},
  {code: '{nr:X}', desc: 'config.invoiceReplacements.nrX', defaultValue: '{nr:4}'},
  {code: '{date:FORMAT}', desc: 'config.invoiceReplacements.date', defaultValue: '{date:YYYY-MM}'},
  {code: '{orderNr}', desc: 'config.invoiceReplacements.orderNr'},
  {code: '{clientName}', desc: 'config.invoiceReplacements.clientName'},

  {code: '{projectMonth:FORMAT}', desc: 'config.invoiceReplacements.projectMonth', defaultValue: '{projectMonth:YYYY-MM}'},
  {code: '{consultantName}', desc: 'config.invoiceReplacements.consultantName'},
];



export function getInvoiceReplacements(invoice: InvoiceModel): ITextEditorCustomReplacement[] {
  const result: ITextEditorCustomReplacement[] = [
    {code: '{nr}', desc: 'config.invoiceReplacements.nr'},
    {code: '{date:DD/MM/YYYY}', desc: 'config.invoiceReplacements.dateShort'},
    {code: '{orderNr}', desc: 'config.invoiceReplacements.orderNr'},
    {code: '{clientName}', desc: 'config.invoiceReplacements.clientName'},
  ];

  if (invoice.projectMonth) {
    result.push({code: '{projectMonth:MMMM YYYY}', desc: 'config.invoiceReplacements.projectMonthShort'});
    result.push({code: '{consultantName}', desc: 'config.invoiceReplacements.consultantName'});
  }

  return result.map(replacement => ({
    code: t(replacement.desc),
    desc: '',
    defaultValue: invoiceReplacements(replacement.code, invoice),
  }));
}



export function invoiceReplacements(input: string, invoice: InvoiceModel): string {
  let str = input;

  const appLanguage = moment.locale();
  const clientLanguage = invoice.client?.language;
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


  const dateRegex = /\{date:([^}]+)\}/g;
  const datesToReplace: {needle: string; format: string}[] = [];
  let dateMatch = dateRegex.exec(str);
  while (dateMatch) {
    const dateFormat = dateMatch[1];
    datesToReplace.push({needle: dateMatch[0], format: dateFormat});
    dateMatch = dateRegex.exec(str);
  }
  datesToReplace.forEach(replace => str = str.replace(replace.needle, clientFormat(invoice.date, replace.format)));


  const projectMonthRegex = /\{projectMonth:([^}]+)\}/;
  const projectMonthMatch = str.match(projectMonthRegex);
  if (projectMonthMatch) {
    const dateFormat = projectMonthMatch[1];
    if (invoice.projectMonth?.month) {
      str = str.replace(projectMonthRegex, clientFormat(moment(invoice.projectMonth.month), dateFormat));
    } else {
      str = str.replace(projectMonthRegex, clientFormat(invoice.date, dateFormat));
    }
  }

  if (invoice.projectMonth?.consultantName && str.indexOf('{consultantName}') !== -1) {
    str = str.replace('{consultantName}', invoice.projectMonth.consultantName);
  } else {
    str = str.replace('{consultantName}', '???');
  }

  if (str.indexOf('{orderNr}') !== -1) {
    str = str.replace('{orderNr}', invoice.orderNr);
  }

  if (str.indexOf('{clientName}') !== -1) {
    str = str.replace('{clientName}', invoice.client?.name);
  }

  // Object.keys(data).forEach(invoiceProp => {
  //   str = str.replace('{' + invoiceProp + '}', data[invoiceProp]);
  // });

  if (clientLanguage) {
    moment.locale(appLanguage);
  }

  return str;
}
