import pdf from 'html-pdf';
import pug from 'pug';

import appConfig from '../../config';
import locals from '../../pug-helpers';
import {IInvoice, IExtraFieldsObject} from '../../models/invoices';

export const convertHtmlToBuffer = (html: string): Promise<Buffer> => new Promise((resolve, reject) => {
  pdf.create(html).toBuffer((err, buffer) => {
    if (err) {
      console.log('convertHtmlToBuffer error', err);
      reject();
    }
    resolve(buffer);
  });
});

export const createHtml = (invoice: IInvoice): string | { error: string; } => {
  // BUG: extraFields was an array [{key, value}, {}, ...]
  // But this code converted it to an object {key1, key2, ...}
  // Was saved like this in the db and then crashed because Object.prototype doesn't have a reduce function
  if (Array.isArray(invoice.extraFields)) {
    // eslint-disable-next-line no-param-reassign
    invoice.extraFields = invoice.extraFields.reduce((acc: IExtraFieldsObject, field) => { // ! DANGEROUS: Directly mutating extraFields
      const label = field.label.toString().toLowerCase();
      acc[label] = field.value;
      return acc;
    }, {});
  }

  let generateHtmlTemplate: pug.compileTemplate;
  const templateType = invoice.isQuotation ? invoice.your.templateQuotation : invoice.your.template;

  try {
    generateHtmlTemplate = pug.compileFile(getTemplatesPath() + templateType);
  } catch (e) {
    console.log('TemplateNotFound', e);
    return {error: 'TemplateNotFound'};
  }

  const assetsPath = `http://${appConfig.server.host}:${appConfig.server.port}`;

  return generateHtmlTemplate({
    ...locals,
    ...invoice,
    origin: assetsPath,
  });
};

export const createPdf = async (params: IInvoice) => {
  const html = createHtml(params);

  if (typeof html !== 'string' && html.error) {
    return html;
  }

  const pdfBuffer = convertHtmlToBuffer(html as string);
  return pdfBuffer;
};

export const getTemplatesPath = (): string => {
  if (appConfig.enable_root_templates) {
    return '/templates/';
  }
  return './templates/';

};