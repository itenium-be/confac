import pdf from 'html-pdf';
import pug from 'pug';

import appConfig from '../../config';
import locals from '../../pug-helpers';
import {IInvoice} from '../../models/invoices';

// See: https://github.com/marcbachmann/node-html-pdf/issues/531
const pdfOptions = {
  childProcessOptions: {
    env: {
      OPENSSL_CONF: '/dev/null',
    },
  }
};


export const convertHtmlToBuffer = (html: string): Promise<Buffer> => new Promise((resolve, reject) => {
  pdf.create(html, pdfOptions).toBuffer((err, buffer) => {
    if (err) {
      console.log('convertHtmlToBuffer error', err); // eslint-disable-line
      reject();
    }
    resolve(buffer);
  });
});

export const createHtml = (invoice: IInvoice): string | { error: string; } => {
  /* eslint-disable no-param-reassign */
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
    console.log('TemplateNotFound', e); // eslint-disable-line
    return {error: 'TemplateNotFound'};
  }

  const assetsPath = `http://${appConfig.server.host}:${appConfig.server.port}`;

  return generateHtmlTemplate({
    ...locals,
    ...invoice,
    origin: assetsPath,
  });
};

export const createPdf = (params: IInvoice) => {
  const html = createHtml(params);

  if (typeof html !== 'string' && html.error) {
    return html;
  }

  const pdfBuffer = convertHtmlToBuffer(html as string);
  return pdfBuffer;
};

export const getTemplatesPath = (): string => {
  if (appConfig.ENABLE_ROOT_TEMPLATES) {
    return '/templates/';
  }
  return './templates/';
};
