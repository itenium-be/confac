import { AccountingCustomerParty, AccountingSupplierParty, AdditionalDocumentReference, AdditionalDocumentReferenceParams, ClassifiedTaxCategory, Contact, Country, InvoiceLine, Item, LegalMonetaryTotal, OrderReference, Party, PartyLegalEntity, PartyName, PartyTaxScheme, PaymentMeans, PostalAddress, Price, TaxCategory, TaxScheme, TaxSubtotal, TaxTotal } from "ubl-builder/lib/ubl21/CommonAggregateComponents";
import { COUNTRY_CODES, ENDPOINT_SCHEMES, IInvoice, UNIT_CODES, InvoiceLine as IInvoiceLine } from "../../models/invoices";
import { UdtAmount, UdtIdentifier, UdtName, UdtQuantity } from "ubl-builder/lib/ubl21/types/UnqualifiedDataTypes";
import { DEFAULT_COUNTRY_CODE } from "../config";
import { PayeeFinancialAccount } from "ubl-builder/lib/ubl21/CommonAggregateComponents/PayeeFinancialAccount";
import { FinancialInstitutionBranch } from "ubl-builder/lib/ubl21/CommonAggregateComponents/FinancialInstitutionBranch";
import { SellersItemIdentification } from "ubl-builder/lib/ubl21/CommonAggregateComponents/SellersItemIdentification";
import { v4 as uuidv4 } from 'uuid'
import { Invoice } from "ubl-builder";
import { XMLBuilder, XMLParser } from "fast-xml-parser";

const companyNumberScheme = '0208';

export const createAccountingSupplierParty = (invoice: IInvoice, taxScheme: TaxScheme): AccountingSupplierParty => {
  /**
   * https://docs.peppol.eu/poacc/billing/3.0/syntax/ubl-invoice/cac-AccountingSupplierParty/
   */
  const supplierPostalAddress = new PostalAddress({
    streetName: invoice.your.address.trim(),
    cityName: invoice.your.city.trim(),
    country: new Country({identificationCode: DEFAULT_COUNTRY_CODE}),
    postalZone: invoice.your.postalCode.trim(),
  });

  const companyNumber = createCompanyNumber(invoice.your.btw, 'BE');

  const supplierEndpointID = new UdtIdentifier(companyNumber, {
    schemeID: companyNumberScheme
  });

  const cleanedVat = cleanVat(invoice.your.btw);

  const supplierLegalEntity = new PartyLegalEntity({
    registrationName: invoice.your.name,
    companyID: companyNumber
  });

  const supplierParty = new Party({
    partyNames: [
      new PartyName({
        name: new UdtName(invoice.your.name)
      })
    ],
    EndpointID: supplierEndpointID,
    partyLegalEntities: [supplierLegalEntity],
    postalAddress: supplierPostalAddress,
    contact: new Contact({
      name: invoice.your.name,
      electronicMail: invoice.your.email,
      telephone: invoice.your.telephone?.replace('+', '00') ?? ''
    }),
    partyTaxSchemes: [new PartyTaxScheme({
      companyID: cleanedVat,
      taxScheme: taxScheme
    })]
  });

  const accountingSupplierParty = new AccountingSupplierParty({
    party: supplierParty
  });

  return accountingSupplierParty;
}

export const createAccountingCustomerParty = (invoice: IInvoice, taxScheme: TaxScheme): AccountingCustomerParty => {
  /**
   * https://docs.peppol.eu/poacc/billing/3.0/syntax/ubl-invoice/cac-AccountingCustomerParty/
   */

  const customerCountryAndCode = COUNTRY_CODES.find(codes => codes.country === invoice.client.country || codes.code === invoice.client.country);

  const customerPostalAddress = new PostalAddress({
    streetName: invoice.client.address?.trim() ?? '',
    cityName: invoice.client.city?.trim() ?? '',
    country: new Country({identificationCode: customerCountryAndCode ? customerCountryAndCode.code : DEFAULT_COUNTRY_CODE}),
    postalZone: invoice.client.postalCode?.trim() ?? '',
  });

  const companyNumber = createCompanyNumber(invoice.client.btw, customerCountryAndCode?.code ?? DEFAULT_COUNTRY_CODE);

  const customerLegalEntity = new PartyLegalEntity({
    registrationName: invoice.client.name,
    companyID: companyNumber
  });

  const cleanedVat = cleanVat(invoice.your.btw);

  const customerEndpointScheme = ENDPOINT_SCHEMES.find(scheme => scheme.country === customerCountryAndCode?.country ? customerCountryAndCode.code : DEFAULT_COUNTRY_CODE);

  const customerEndpointID = new UdtIdentifier(cleanedVat, {
    schemeID: customerEndpointScheme ? customerEndpointScheme.schemeID : ''
  });

  const customerParty = new Party({
    partyNames: [
      new PartyName({
        name: new UdtName(invoice.client.name)
      })
    ],
    EndpointID: customerEndpointID,
    partyLegalEntities: [customerLegalEntity],
    postalAddress: customerPostalAddress,
    partyTaxSchemes: [new PartyTaxScheme({
      companyID: cleanedVat,
      taxScheme: taxScheme
    })]
  });

  const accountingCustomerParty = new AccountingCustomerParty({
    party: customerParty
  });

  return accountingCustomerParty;
}

export const createLegalMonetaryTotal = (invoice: IInvoice, currency: {currencyID: string}): LegalMonetaryTotal => {
  /**
   * https://docs.peppol.eu/poacc/billing/3.0/syntax/ubl-invoice/cac-LegalMonetaryTotal/
   */
  const legalMonetaryTotal = new LegalMonetaryTotal({
    lineExtensionAmount: new UdtAmount(invoice.money.totalWithoutTax.toFixed(2), currency),
    taxInclusiveAmount: new UdtAmount(invoice.money.total.toFixed(2), currency),
    taxExclusiveAmount: new UdtAmount(invoice.money.totalWithoutTax.toFixed(2), currency),
    payableAmount: new UdtAmount(invoice.money.total.toFixed(2), currency)
  });

  return legalMonetaryTotal;
}

export const createTaxTotal = (invoice: IInvoice, taxCategory: TaxCategory, currency: {currencyID: string}): TaxTotal => {
  /**
   * https://docs.peppol.eu/poacc/billing/3.0/syntax/ubl-invoice/cac-TaxTotal/
   */
  const taxTotal = new TaxTotal({
    taxAmount: new UdtAmount(invoice.money.totalTax.toFixed(2), currency),
    taxSubtotals: [new TaxSubtotal({
      taxableAmount: new UdtAmount(invoice.money.totalWithoutTax.toFixed(2), currency),
      taxAmount: new UdtAmount(invoice.money.totalTax.toFixed(2), currency),
      taxCategory: taxCategory
    })]
  });

  return taxTotal;
}

export const createTaxObjects = (invoice: IInvoice, taxScheme: TaxScheme) : { taxCategory: TaxCategory, classifiedTaxCategory: ClassifiedTaxCategory } => {
  /**
   * More info on the tax codes: https://docs.peppol.eu/poacc/billing/3.0/codelist/UNCL5305/
   * More info on vatex codes: https://docs.peppol.eu/poacc/billing/3.0/codelist/vatex/
   * and on the reason codes: https://docs.peppol.eu/poacc/billing/3.0/syntax/ubl-invoice/cac-TaxTotal/cac-TaxSubtotal/cac-TaxCategory/cbc-TaxExemptionReasonCode/
   */
  const customerCountryAndCode = COUNTRY_CODES.find(codes => codes.country === invoice.client.country || codes.code === invoice.client.country);

  if (customerCountryAndCode?.code === 'UK') {
    const outsideEuropeTaxChargeCode = 'G';
    const outsideEuropeTaxChargeReasonCode = 'VATEX-EU-G';
    return {
      taxCategory : new TaxCategory({
        id: outsideEuropeTaxChargeCode,
        percent: '0',
        taxExemptionReasonCode: outsideEuropeTaxChargeReasonCode,
        taxScheme: taxScheme
      }),
      classifiedTaxCategory: new ClassifiedTaxCategory({
        id: outsideEuropeTaxChargeCode,
        percent: '0',
        taxScheme: taxScheme
      })
    }
  }
  else if (customerCountryAndCode?.code !== DEFAULT_COUNTRY_CODE) {
    const reversedTaxChargeCode = 'AE';
    const reversedTaxChargeReasonCode = 'VATEX-EU-AE';
    return {
      taxCategory : new TaxCategory({
        id: reversedTaxChargeCode,
        percent: '0',
        taxExemptionReasonCode: reversedTaxChargeReasonCode,
        taxScheme: taxScheme
      }),
      classifiedTaxCategory: new ClassifiedTaxCategory({
        id: reversedTaxChargeCode,
        percent: '0',
        taxScheme: taxScheme
      })
    }
  }

  const vat: number = 21
  const standardTaxChargeCode = 'S';
  return {
    taxCategory: new TaxCategory({
      id: standardTaxChargeCode,
      percent: vat.toFixed(2),
      taxScheme: taxScheme
    }),
    classifiedTaxCategory: new ClassifiedTaxCategory({
      id: standardTaxChargeCode,
      percent: vat.toFixed(2),
      taxScheme: taxScheme
    })
  }
}

export const createPaymentMeans = (invoice: IInvoice): PaymentMeans => {
  /**
   * https://docs.peppol.eu/poacc/billing/3.0/syntax/ubl-invoice/cac-PaymentMeans/
   * more info on PaymentMeans codes: https://docs.peppol.eu/poacc/billing/3.0/codelist/UNCL4461/
   */
  const debitPaymentMeansCode = '30';
  const iban = invoice.your.iban.split(' ').join('')
  const paymentMeans = new PaymentMeans({
    paymentMeansCode: debitPaymentMeansCode,
    payeeFinancialAccount: new PayeeFinancialAccount({
      id: iban,
      financialInstitutioBranch: new FinancialInstitutionBranch({
        id: invoice.your.bic
      })
    })
  });

  return paymentMeans;
}

export const createOrderReference = (invoice: IInvoice): OrderReference => {
  /**
   * https://docs.peppol.eu/poacc/billing/3.0/syntax/ubl-invoice/cac-OrderReference/
   */
  const orderRef = invoice.orderNr && invoice.orderNr.trim().length !== 0 ? invoice.orderNr : invoice._id.toString();
  const orderReference = new OrderReference({
    id: orderRef
  })
  return orderReference;
}

export const createInvoiceLine = (invoice: IInvoice, line: IInvoiceLine, index: number, currency: {currencyID: string}, classifiedTaxCategory: ClassifiedTaxCategory) : InvoiceLine => {
   /**
    * https://docs.peppol.eu/poacc/billing/3.0/syntax/ubl-invoice/cac-InvoiceLine/
    * more info on unit codes: https://docs.peppol.eu/poacc/billing/3.0/codelist/UNECERec20/
    * code C62 is a general code meaning 'one' or 'unit'
    */
   const defaultUnitCode = 'C62';
  const unitCode = UNIT_CODES.find(unitCode => unitCode.unit === line.type);
  const invoiceLine = new InvoiceLine({
    id: (index + 1).toString(),
    invoicedQuantity: new UdtQuantity(line.amount.toString(), {unitCode: unitCode ? unitCode.code : defaultUnitCode}),
    lineExtensionAmount: new UdtAmount((line.price * line.amount).toFixed(2), currency),
    item: new Item({
      name: line.desc,
      //sellersItemID is not necessary, but added here to keep TypeScript happy
      sellersItemIdentification: new SellersItemIdentification({
        id: invoice.number + '-' + (index + 1)
      }),
      classifiedTaxCategory: classifiedTaxCategory,

    }),
    price: new Price({
      priceAmount: new UdtAmount(line.price.toFixed(2), currency),
      baseQuantity: '1'
    })
  });

  return invoiceLine
}

export const createAdditionalDocumentReference = (pdf: Buffer | undefined):AdditionalDocumentReference | undefined => {
  if (pdf) {
    const additionalDocumentReference = new AdditionalDocumentReference({
      id: uuidv4(),
      attachment: ''
    } as AdditionalDocumentReferenceParams)

    return additionalDocumentReference;
  }
}

export const postProccess = (invoice: Invoice, pdf: Buffer | undefined, savedInvoice: IInvoice):string => {
  const xml = invoice.getXml();
  //stuff we cant do with ubl builder
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_'
  });

  let jObj = parser.parse(xml);

  //somehow ublbuilder removes leading 0 so we readd it here
  const companyNumber = createCompanyNumber(savedInvoice.your.btw, 'BE');

  if (jObj.Invoice['cac:AccountingSupplierParty']['cac:Party']['cbc:EndpointID']) {
    jObj.Invoice['cac:AccountingSupplierParty']['cac:Party']['cbc:EndpointID'] = {
      '#text': companyNumber,
      '@_schemeID': companyNumberScheme
    }
  }

  if (pdf) {
    jObj.Invoice['cac:AdditionalDocumentReference']['cac:Attachment'] = {
      'cbc:EmbeddedDocumentBinaryObject':{
        '#text': pdf.toString('base64'),
        '@_filename': 'invoice.pdf',
        '@_mimeCode': 'application/pdf'
      }
    };
  }

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: '@_'
  });

  const xmlContent = builder.build(jObj);

  return xmlContent;
}

const cleanVat = (vat: string): string => {
  const cleanedVat = vat
    .split('.').join('')
    .split(' ').join('');

  return cleanedVat;
}

const createCompanyNumber = (vat: string, countryCode: string): string => {
  const companyNumber = cleanVat(vat)
    .replace(countryCode, '');

  switch(countryCode) {
    case 'NL':
      return companyNumber.padStart(12, '0')
    case 'UK':
    case 'DE':
    case 'FR':
      return companyNumber.padStart(9, '0')
    case 'BE':
    default:
        return companyNumber.padStart(10, '0')
  }
}
