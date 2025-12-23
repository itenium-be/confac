import moment from 'moment/moment';
import {CreateOrderRequest, Customer, OrderLine} from '../services/billit';
import {IInvoice, InvoiceLine} from '../models/invoices';
import {IClient} from '../models/clients';

/**
 * Creates a CreateOrderRequest from an IInvoice
 * @param invoice The invoice to convert
 * @returns A CreateOrderRequest object ready to be sent to Billit API
 */
export function fromInvoice(invoice: IInvoice): CreateOrderRequest {
  const {
    isQuotation,
    number,
    date,
    orderNr: Reference,
    client,
  } = invoice;

  if (isQuotation) {
    throw new Error('Quotation unsupported.');
  }

  return {
    OrderType: 'Invoice',
    OrderDirection: 'Income',
    OrderNumber: number.toString(),
    OrderDate: moment(date).format('YYYY-MM-DD'),
    ExpiryDate: moment().add(14, 'days').format('YYYY-MM-DD'), // 14 days from now, TODO: Make configurable
    Reference,
    Currency: 'EUR',
    PaymentReference: generatePaymentReference(number),
    Customer: getCustomer(client),
    OrderLines: getOrderLines(invoice),
  };
}

/**
 * Generates a Belgian structured payment reference
 * Format: +++nnn/nnnn/nnnnn+++
 */
function generatePaymentReference(invoiceNumber: number): string {
  // Pad invoice number to 10 digits
  const paddedNumber: string = invoiceNumber.toString().padStart(10, '0');

  // Split into parts: nnn/nnnn/nnnnn (3/4/5 digits before check digits)
  const part1: string = paddedNumber.substring(0, 3);
  const part2: string = paddedNumber.substring(3, 7);
  const part3: string = paddedNumber.substring(7, 10);

  // Calculate modulo 97 check digits
  const baseNumber: number = parseInt(paddedNumber, 10);
  const checkDigits: string = (baseNumber % 97).toString().padStart(2, '0');

  return `+++${part1}/${part2}/${part3}${checkDigits}+++`;
}

function getCustomer(client: IClient): Customer {
  const {
    name: Name,
    address,
    city: City,
    postalCode: Zipcode,
    country: CountryCode,
  } = client;

  return {
    Name,
    VATNumber: getVatNumber(client),
    PartyType: 'Customer',
    Addresses: [
      {
        AddressType: 'InvoiceAddress',
        Name,
        Street: address,
        // StreetNumber: '', TODO: Split street and street number from address
        City,
        Zipcode,
        CountryCode,
      },
    ],
  };
}

function getVatNumber(client: IClient): string {
  return client.btw
    .replace(/\s/g, '') // Strip spaces
    .replace(/\./g, ''); // Strip dots
}

function getOrderLines(invoice: IInvoice): OrderLine[] {
  return invoice.lines.map(
    line => getOrderLine(line),
  );
}

function getOrderLine(invoiceLine: InvoiceLine): OrderLine {
  const {
    amount: Quantity,
    price: UnitPriceExcl,
    desc: Description,
    tax: VATPercentage,
  } = invoiceLine;

  return {
    Quantity,
    UnitPriceExcl,
    Description,
    VATPercentage,
  };
}
