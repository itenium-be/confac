import pdf from 'html-pdf';
import pug from 'pug';
import {Logger} from 'winston';
import {Db, ObjectID} from 'mongodb';
import appConfig from '../../config';
import locals from '../../pug-helpers';
import {IInvoice} from '../../models/invoices';
import {CollectionNames} from '../../models/common';

// See: https://github.com/marcbachmann/node-html-pdf/issues/531
const pdfOptions = {childProcessOptions: {env: {OPENSSL_CONF: '/dev/null'}}};

interface IInvoiceWithCreditNotaNumbers extends IInvoice {
  creditNotaNumbers?: number[];
}

export const convertHtmlToBuffer = (logger: Logger, html: string): Promise<Buffer> => new Promise((resolve, reject) => {
  pdf.create(html, pdfOptions as any).toBuffer((err, buffer) => {
    if (err) {
      logger.error('convertHtmlToBuffer error', err);
      reject();
    }
    resolve(buffer);
  });
});

export const createHtml = (logger: Logger, invoice: IInvoiceWithCreditNotaNumbers): string | {error: string} => {
   
  invoice = JSON.parse(JSON.stringify(invoice));
  // if (Array.isArray(invoice.extraFields)) {
  //   invoice.extraFields = invoice.extraFields.reduce((acc: IExtraFieldsObject, field) => {
  //     const label = field.label.toString().toLowerCase();
  //     acc[label] = field.value;
  //     return acc;
  //   }, {});
  // }

  let generateHtmlTemplate: pug.compileTemplate;
  const templateType = invoice.isQuotation ? invoice.your.templateQuotation : invoice.your.template;

  try {
    generateHtmlTemplate = pug.compileFile(getTemplatesPath() + templateType);
  } catch (e) {
    logger.error('TemplateNotFound', e);
    return {error: 'TemplateNotFound'};
  }

  const assetsPath = `http://${appConfig.server.host}:${appConfig.server.port}`;

  return generateHtmlTemplate({
    ...locals,
    ...invoice,
    origin: assetsPath,
  });
};

export const createPdf = async (logger: Logger, invoice: IInvoice, db: Db) => {
  let invoiceForPdf: IInvoiceWithCreditNotaNumbers = invoice;

  if (invoice.creditNotas?.length) {
    const linkedInvoiceIds = invoice.creditNotas.map(id => new ObjectID(id));
    const linkedInvoices = await db.collection<IInvoice>(CollectionNames.INVOICES)
      .find({_id: {$in: linkedInvoiceIds}})
      .toArray();
    invoiceForPdf = {
      ...invoice,
      creditNotaNumbers: linkedInvoices.map(i => i.number),
    };
  }

  const html = createHtml(logger, invoiceForPdf);

  if (typeof html !== 'string' && html.error) {
    return html;
  }

  const pdfBuffer = convertHtmlToBuffer(logger, html as string);
  return pdfBuffer;
};

export const getTemplatesPath = (): string => {
  if (appConfig.ENABLE_ROOT_TEMPLATES) {
    return '/templates/';
  }
  return './templates/';
};
