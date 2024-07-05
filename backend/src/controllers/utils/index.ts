import pdf from 'html-pdf';
import pug from 'pug';

import appConfig from '../../config';
import locals from '../../pug-helpers';
import {IInvoice} from '../../models/invoices';
import moment from 'moment';
import {Invoice} from 'ubl-builder';
import {TaxScheme } from 'ubl-builder/lib/ubl21/CommonAggregateComponents';
import {DEFAULT_CURRENCY} from '../config';
import {
  createAccountingCustomerParty,
  createAccountingSupplierParty,
  createAdditionalDocumentReference,
  createInvoiceLine,
  createLegalMonetaryTotal,
  createOrderReference,
  createPaymentMeans,
  createTaxObjects,
  createTaxTotal,
  postProccess} from './peppol';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';

// See: https://github.com/marcbachmann/node-html-pdf/issues/531
const pdfOptions = {
  childProcessOptions: {
    env: {
      OPENSSL_CONF: '/dev/null',
    },
  }
};


export const convertHtmlToBuffer = (html: string): Promise<Buffer> => new Promise((resolve, reject) => {
  pdf.create(html, pdfOptions as any).toBuffer((err, buffer) => {
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

/**
 *This method creates an invoice xml following UBL 2.1 standard, required for Peppol protocol.
  Check https://docs.peppol.eu/poacc/billing/3.0/ for full documentation.
 */
export const createXml = (savedInvoice: IInvoice, pdf?: Buffer): string => {
  const invoiceXml = new Invoice(savedInvoice.number.toString(), {
    //This empty object is created to keep TypeScript from complaining, it has no influence on the generated xml
    issuer: {
      prefix: '',
      endDate: '',
      endRange: '',
      resolutionNumber: '',
      startDate: '',
      startRange: '',
      technicalKey: ''
    },
    software: {
      id: '',
      pin: '',
      providerNit: ''
    }
  });
  if (savedInvoice) {
    const currencyID = {currencyID: DEFAULT_CURRENCY};
    const taxSchemeIDVAT = new TaxScheme({id: 'VAT'});

    const accountingSupplierParty = createAccountingSupplierParty(savedInvoice, taxSchemeIDVAT);
    const accountingCustomerParty = createAccountingCustomerParty(savedInvoice, taxSchemeIDVAT);
    const legalMonetaryTotal = createLegalMonetaryTotal(savedInvoice, currencyID);
    const {taxCategory, classifiedTaxCategory} = createTaxObjects(savedInvoice, taxSchemeIDVAT);
    const taxTotal = createTaxTotal(savedInvoice, taxCategory, currencyID);
    const paymentMeans = createPaymentMeans(savedInvoice);
    const orderReference = createOrderReference(savedInvoice);


    const additionalDocumentReference = createAdditionalDocumentReference(pdf);

    if(additionalDocumentReference){
      invoiceXml.addAdditionalDocumentReference(additionalDocumentReference);
    }

    /** More info on invoice type codes: https://docs.peppol.eu/poacc/billing/3.0/codelist/UNCL1001-inv/
     *  Code 380 signals a commercial invoice.
    */
    const commercialInvoiceTypeCode = '380';

    invoiceXml.addProperty('xmlns', 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2');
    invoiceXml.addProperty('xmlns:cac', 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2');
    invoiceXml.addProperty('xmlns:cbc', 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2');
    invoiceXml.setCustomizationID('urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0');
    invoiceXml.setProfileID('urn:fdc:peppol.eu:2017:poacc:billing:01:1.0');
    invoiceXml.setIssueDate(moment(savedInvoice.date).format('YYYY-MM-DD'));
    invoiceXml.setDueDate(moment(savedInvoice.date).add(30, 'days').format('YYYY-MM-DD'));
    invoiceXml.setInvoiceTypeCode(commercialInvoiceTypeCode);
    invoiceXml.setDocumentCurrencyCode(DEFAULT_CURRENCY);
    invoiceXml.setAccountingSupplierParty(accountingSupplierParty);
    invoiceXml.setAccountingCustomerParty(accountingCustomerParty);
    invoiceXml.setLegalMonetaryTotal(legalMonetaryTotal);
    invoiceXml.setID(savedInvoice._id.toString());
    invoiceXml.setOrderReference(orderReference);
    invoiceXml.addTaxTotal(taxTotal);
    invoiceXml.addPaymentMeans(paymentMeans);


    savedInvoice.lines.forEach((line, index:number) => {
      const createdInvoiceLine = createInvoiceLine(savedInvoice, line, index, currencyID, classifiedTaxCategory)
      invoiceXml.addInvoiceLine(createdInvoiceLine);
    });

  }

  const xml = postProccess(invoiceXml, pdf, savedInvoice);
  return xml;
}

