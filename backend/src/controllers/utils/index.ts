import pdf from 'html-pdf';
import pug from 'pug';

import appConfig from '../../config';
import locals from '../../pug-helpers';
import {COUNTRY_CODES, ENDPOINT_SCHEMES, IInvoice, UNIT_CODES} from '../../models/invoices';
import moment from 'moment';
import {Invoice} from 'ubl-builder';
import {TaxScheme, PostalAddress, Country, PartyLegalEntity, Party, Contact, PartyTaxScheme, AccountingSupplierParty, AccountingCustomerParty, LegalMonetaryTotal, TaxTotal, TaxSubtotal, TaxCategory, PaymentMeans, OrderReference, InvoiceLine, Item, ClassifiedTaxCategory, Price} from 'ubl-builder/lib/ubl21/CommonAggregateComponents';
import {FinancialInstitutionBranch} from 'ubl-builder/lib/ubl21/CommonAggregateComponents/FinancialInstitutionBranch';
import {PayeeFinancialAccount} from 'ubl-builder/lib/ubl21/CommonAggregateComponents/PayeeFinancialAccount';
import {UdtIdentifier, UdtAmount, UdtPercent, UdtQuantity} from 'ubl-builder/lib/ubl21/types/UnqualifiedDataTypes';
import {SellersItemIdentification} from 'ubl-builder/lib/ubl21/CommonAggregateComponents/SellersItemIdentification';
import {DEFAULT_COUNTRY_CODE, DEFAULT_CURRENCY} from '../config';

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
export const createXml = (savedInvoice: IInvoice): string => {
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
    const customerCountryAndCode = COUNTRY_CODES.find(codes => codes.country === savedInvoice.client.country || codes.code === savedInvoice.client.country);

    const customerPostalAddress = new PostalAddress({
      streetName: savedInvoice.client.address.trim(),
      cityName: savedInvoice.client.city.trim(),
      country: new Country({identificationCode: customerCountryAndCode ? customerCountryAndCode.code : DEFAULT_COUNTRY_CODE})
    });

    const supplierPostalAddress = new PostalAddress({
      streetName: savedInvoice.your.address.trim(),
      cityName: savedInvoice.your.city.trim(),
      country: new Country({identificationCode: DEFAULT_COUNTRY_CODE})
    });
    const supplierLegalEntity = new PartyLegalEntity({
      registrationName: savedInvoice.your.name,
      companyID: savedInvoice.your.btw
    });

    const belgianVATEndpointScheme = '9925';
    const supplierEndpointScheme = ENDPOINT_SCHEMES.find(scheme => scheme.country === DEFAULT_COUNTRY_CODE);
    const supplierEndpointID = new UdtIdentifier(savedInvoice.your.btw, {
      schemeID: supplierEndpointScheme ? supplierEndpointScheme.schemeID : belgianVATEndpointScheme
    });

    const supplierParty = new Party({
      EndpointID: supplierEndpointID,
      partyLegalEntities: [supplierLegalEntity],
      postalAddress: supplierPostalAddress,
      contact: new Contact({
        name: savedInvoice.your.website,
        electronicMail: savedInvoice.your.email,
        telephone: savedInvoice.your.telephone
      }),
      partyTaxSchemes: [new PartyTaxScheme({
        companyID: savedInvoice.your.btw,
        taxScheme: taxSchemeIDVAT
      })]
    });
    const accountingSupplierParty = new AccountingSupplierParty({
      party: supplierParty
    });

    const customerLegalEntity = new PartyLegalEntity({
      registrationName: savedInvoice.client.name,
      companyID: savedInvoice.client.btw
    });
    const customerEndpointScheme = ENDPOINT_SCHEMES.find(scheme => scheme.country === savedInvoice.client.country);
    const customerEndpointID = new UdtIdentifier(savedInvoice.client.btw, {
      schemeID: customerEndpointScheme ? customerEndpointScheme.schemeID : ''
    });
    const customerParty = new Party({
      EndpointID: customerEndpointID,
      partyLegalEntities: [customerLegalEntity],
      postalAddress: customerPostalAddress,
      partyTaxSchemes: [new PartyTaxScheme({
        companyID: savedInvoice.client.btw,
        taxScheme: taxSchemeIDVAT
      })]
    });
    const accountingCustomerParty = new AccountingCustomerParty({
      party: customerParty
    });

    const legalMonetaryTotal = new LegalMonetaryTotal({
      lineExtensionAmount: new UdtAmount(savedInvoice.money.totalWithoutTax.toFixed(2), currencyID),
      taxInclusiveAmount: new UdtAmount(savedInvoice.money.total.toFixed(2), currencyID),
      taxExclusiveAmount: new UdtAmount(savedInvoice.money.totalWithoutTax.toFixed(2), currencyID),
      payableAmount: new UdtAmount(savedInvoice.money.total.toFixed(2), currencyID)
    });


    /** More info on the tax codes: https://docs.peppol.eu/poacc/billing/3.0/codelist/UNCL5305/ 
     * and on the reason codes: https://docs.peppol.eu/poacc/billing/3.0/syntax/ubl-invoice/cac-TaxTotal/cac-TaxSubtotal/cac-TaxCategory/cbc-TaxExemptionReasonCode/
     */
    let taxObject: {id: string | UdtIdentifier; percent: string | UdtPercent; taxScheme: TaxScheme | undefined; taxExemptionReasonCode?: string | undefined};
    let classifiedTaxObject: {id: string | UdtIdentifier; percent: string | UdtPercent; taxScheme: TaxScheme | undefined};
    const reversedTaxChargeCode = 'AE';
    const standardTaxChargeCode = 'S';
    const reversedTaxChargeReasonCode = 'VATEX-EU-AE';
    if (savedInvoice.client.country !== DEFAULT_COUNTRY_CODE) {
      taxObject = {
        id: reversedTaxChargeCode,
        percent: '0',
        taxExemptionReasonCode: reversedTaxChargeReasonCode,
        taxScheme: taxSchemeIDVAT
      }
      classifiedTaxObject = {
        id: reversedTaxChargeCode,
        percent: '0',
        taxScheme: taxSchemeIDVAT
      }
    } else {
      taxObject = {
        id: standardTaxChargeCode,
        percent: '21',
        taxScheme: taxSchemeIDVAT
      }
      classifiedTaxObject = taxObject;
    }


    const taxTotal = new TaxTotal({
      taxAmount: new UdtAmount(savedInvoice.money.totalTax.toFixed(2), currencyID),
      taxSubtotals: [new TaxSubtotal({
        taxableAmount: new UdtAmount(savedInvoice.money.totalWithoutTax.toFixed(2), currencyID),
        taxAmount: new UdtAmount(savedInvoice.money.totalTax.toFixed(2), currencyID),
        taxCategory: new TaxCategory(taxObject)
      })]
    });

    /** more info on PaymentMeans codes: https://docs.peppol.eu/poacc/billing/3.0/codelist/UNCL4461/ */
    const debitPaymentMeansCode = '31';
    const paymentMeans = new PaymentMeans({
      paymentMeansCode: debitPaymentMeansCode,
      payeeFinancialAccount: new PayeeFinancialAccount({
        id: savedInvoice.your.iban,
        financialInstitutioBranch: new FinancialInstitutionBranch({
          id: savedInvoice.your.bic
        })
      })
    });

    const orderRef = savedInvoice.orderNr && savedInvoice.orderNr.trim().length !== 0 ? savedInvoice.orderNr : savedInvoice._id;
    
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
    invoiceXml.setID(savedInvoice.number.toString());
    invoiceXml.setOrderReference(new OrderReference({id: orderRef}));
    invoiceXml.addTaxTotal(taxTotal);
    invoiceXml.addPaymentMeans(paymentMeans);

    /** more info on unit codes: https://docs.peppol.eu/poacc/billing/3.0/codelist/UNECERec20/ 
     * code C62 is a general code meaning 'one' or 'unit'
    */
    const defaultUnitCode = 'C62';
    savedInvoice.lines.forEach((line, index) => {
      const unitCode = UNIT_CODES.find(unitCode => unitCode.unit === line.type);
      const invoiceLine = new InvoiceLine({
        id: (index + 1).toString(),
        invoicedQuantity: new UdtQuantity(line.amount.toString(), {unitCode: unitCode ? unitCode.code : defaultUnitCode}),
        lineExtensionAmount: new UdtAmount((line.price * line.amount).toFixed(2), currencyID),
        item: new Item({
          name: line.desc,
          //sellersItemID is not necessary, but added here to keep TypeScript happy
          sellersItemIdentification: new SellersItemIdentification({
            id: savedInvoice.number + '-' + (index + 1)
          }),
          classifiedTaxCategory: new ClassifiedTaxCategory(classifiedTaxObject)
        }),
        price: new Price({
          priceAmount: new UdtAmount(line.price.toFixed(2), currencyID),
          baseQuantity: '1'
        })
      });
      invoiceXml.addInvoiceLine(invoiceLine);
    });
  }

  return invoiceXml.getXml();
}
