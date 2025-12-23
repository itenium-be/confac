import {IInvoice} from '../../../../models/invoices';

/**
 * Generates a Belgian structured payment reference from an invoice
 * Format: +++nnn/nnnn/nnnnn+++
 * @param invoice The invoice to generate a payment reference for
 * @returns A structured payment reference string
 */
export function fromInvoice(invoice: IInvoice): string {
  const invoiceNumber: number = invoice.number;

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
