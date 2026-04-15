import pug from 'pug';
import {Logger} from 'winston';
import {Db, ObjectID} from 'mongodb';
import appConfig from '../../config';
import locals from '../../pug-helpers';
import {IInvoice} from '../../models/invoices';
import {CollectionNames} from '../../models/common';

interface IInvoiceWithCreditNotaNumbers extends IInvoice {
  creditNotaNumbers?: number[];
}

export const convertHtmlToBuffer = async (logger: Logger, html: string): Promise<Buffer> => {
  if (!appConfig.services.gotenbergUrl) {
    const msg = 'GOTENBERG_URL is not configured — cannot render PDF';
    logger.error(msg);
    throw new Error(msg);
  }

  const url = `${appConfig.services.gotenbergUrl}/forms/chromium/convert/html`;
  logger.info(`Gotenberg convert start: htmlLen=${html.length}, url=${url}`);

  const form = new FormData();
  form.append('files', new Blob([html], {type: 'text/html'}), 'index.html');
  // Fail loud on broken assets so a broken invoice surfaces as a 500 instead
  // of silently shipping a PDF with holes. Two flags: one for network-level
  // failures (DNS, connection refused), one for HTTP error responses (404, 5xx).
  form.append('failOnResourceLoadingFailed', 'true');
  form.append('failOnResourceHttpStatusCodes', '[401,403,404,500,502,503,504]');

  let res: Response;
  try {
    res = await fetch(url, {method: 'POST', body: form});
  } catch (err) {
    const cause = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    const msg = `Gotenberg fetch failed (${url}): ${cause}`;
    logger.error(msg, {url, err});
    throw new Error(msg);
  }

  if (!res.ok) {
    const body = await res.text();
    const bodyPreview = body.slice(0, 500);
    const headers = Object.fromEntries(res.headers.entries());
    const servedByGotenberg = 'gotenberg-trace' in headers;
    const msg = `Gotenberg returned ${res.status} ${res.statusText} for ${url} `
      + `(servedByGotenberg=${servedByGotenberg}): ${bodyPreview}`;
    logger.error(msg, {
      url,
      status: res.status,
      statusText: res.statusText,
      headers,
      body,
    });
    throw new Error(msg);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  logger.info(`Gotenberg convert success: status=${res.status}, bytes=${buf.length}`);
  return buf;
};

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
