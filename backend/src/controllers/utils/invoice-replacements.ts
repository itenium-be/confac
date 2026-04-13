// Keep in sync with frontend/src/components/invoice/invoice-replacements.tsx
// (no shared folder in the repo — duplicate until one is introduced).
import Handlebars from 'handlebars';
import moment from 'moment';
import {IInvoice} from '../../models/invoices';


Handlebars.registerHelper('formatDate', (date: moment.MomentInput, format: string) => {
  return moment(date).format(format);
});

Handlebars.registerHelper('zero', (nr: number, amount: string) => {
  const nrSize = Math.max(parseInt(amount, 10), nr.toString().length);
  return `000000${nr}`.slice(-nrSize);
});


export function invoiceReplacements(input: string, invoice: IInvoice, creditNotes?: IInvoice[]): string {
  const template = Handlebars.compile(input);

  const appLanguage = moment.locale();
  const clientLanguage = (invoice.client as unknown as {language?: string}).language;
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
    creditNotes: creditNotes?.map(x => x.number).join(', '),
  };

  const result = template(replacements);

  if (clientLanguage) {
    moment.locale(appLanguage);
  }

  return result;
}
