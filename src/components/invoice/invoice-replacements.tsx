import InvoiceModel from './models/InvoiceModel';



export const invoiceReplacementsPopoverConfig = [
  {code: '{nr}', desc: 'config.invoiceReplacements.nr'},
  {code: '{nr:X}', desc: 'config.invoiceReplacements.nrX', defaultValue: '{nr:4}'},
  {code: '{date:FORMAT}', desc: 'config.invoiceReplacements.date', defaultValue: '{date:YYYY-MM}'},
  {code: '{orderNr}', desc: 'config.invoiceReplacements.orderNr'},
  {code: '{clientName}', desc: 'config.invoiceReplacements.clientName'},
  // {code: '', desc: 'config.invoiceReplacements.'},
  // {code: '', desc: 'config.invoiceReplacements.'},
  // {code: '', desc: 'config.invoiceReplacements.'},
];



export function invoiceReplacements(input: string, invoice: InvoiceModel): string {
  let str = input;

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
    str = str.replace(dateRegex, invoice.date.format(dateFormat));
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

  return str;
}
