import moment from 'moment';
import Handlebars from 'handlebars';
import InvoiceModel from './models/InvoiceModel';
import {t} from '../utils';



export interface ITextEditorCustomReplacement {
  code: string;
  desc: string;
  defaultValue?: string;
}


export const invoiceReplacementsPopoverConfig: ITextEditorCustomReplacement[] = [
  {code: '{{nr}}', desc: 'config.invoiceReplacements.nr'},
  {code: '{{zero nr X}}', desc: 'config.invoiceReplacements.nrX', defaultValue: '{{zero nr 4}}'},
  {code: '{{formatDate date "FORMAT"}}', desc: 'config.invoiceReplacements.date', defaultValue: '{formatDate date "YYYY-MM"}'},
  {code: '{{orderNr}}', desc: 'config.invoiceReplacements.orderNr'},
  {code: '{{clientName}}', desc: 'config.invoiceReplacements.clientName'},

  {code: '{{formatDate projectMonth "FORMAT"}}', desc: 'config.invoiceReplacements.projectMonth', defaultValue: '{{formatDate projectMonth "YYYY-MM"}}'},
  {code: '{{consultantName}}', desc: 'config.invoiceReplacements.consultantName'},
  {code: '{{creditNotes}}', desc: 'config.invoiceReplacements.creditNotes'},
];



export function getInvoiceReplacements(invoice: InvoiceModel): ITextEditorCustomReplacement[] {
  const result: ITextEditorCustomReplacement[] = [
    {code: '{{nr}}', desc: 'config.invoiceReplacements.nr'},
    {code: '{{formatDate date "DD/MM/YYYY"}}', desc: 'config.invoiceReplacements.dateShort'},
    {code: '{{orderNr}}', desc: 'config.invoiceReplacements.orderNr'},
    {code: '{{clientName}}', desc: 'config.invoiceReplacements.clientName'},
    {code: '{{creditNotes}}', desc: 'config.invoiceReplacements.creditNotes'},
  ];

  if (invoice.projectMonth) {
    result.push({code: '{{formatDate projectMonth "MMMM YYYY"}}', desc: 'config.invoiceReplacements.projectMonthShort'});
    result.push({code: '{{consultantName}}', desc: 'config.invoiceReplacements.consultantName'});
  }

  return result.map(replacement => ({
    code: t(replacement.desc),
    desc: '',
    defaultValue: invoiceReplacements(replacement.code, invoice),
  }));
}



Handlebars.registerHelper('formatDate', (date: moment.Moment, format: string) => {
  // Need to wrap moment instances for the locale change to have effect
  return moment(date.toDate()).format(format);
});

Handlebars.registerHelper('zero', (nr: number, amount: string) => {
  const nrSize = Math.max(parseInt(amount, 10), nr.toString().length);
  return `000000${nr}`.slice(-nrSize);
});


export function invoiceReplacements(input: string, invoice: InvoiceModel): string {
  const template = Handlebars.compile(input);

  const appLanguage = moment.locale();
  const clientLanguage = invoice.client?.language;
  if (clientLanguage) {
    moment.locale(clientLanguage);
  }

  const replacements = {
    clientName: invoice.client?.name,
    orderNr: invoice.orderNr,
    consultantName: invoice.projectMonth?.consultantName,
    nr: invoice.number,
    date: invoice.date,
    projectMonth: invoice.projectMonth?.month || invoice.date,
    creditNotes: invoice.creditNotas?.join(', '),
  };

  const result = template(replacements);

  if (clientLanguage) {
    moment.locale(appLanguage);
  }

  return result;
}
