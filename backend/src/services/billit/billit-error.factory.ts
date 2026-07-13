import {BillitOperation, IInvoiceBillitError} from '../../models/invoices';
import {BillitError, BillitErrorDetail} from './billit-error';

export class BillitErrorFactory {
  /** Maps a thrown Billit error to the shape persisted on invoice.billit.errors */
  static toInvoiceError(operation: BillitOperation, error: unknown): IInvoiceBillitError {
    const invoiceError: IInvoiceBillitError = {
      date: new Date().toISOString(),
      operation,
      message: error instanceof Error ? error.message : String(error),
    };

    // Left out entirely rather than set to undefined: the mongo driver stores that as null
    if (error instanceof BillitError) {
      invoiceError.billitErrors = error.billitErrors;
    }

    return invoiceError;
  }

  /**
   * Parses error response and checks if it contains structured errors
   */
  private static parseErrorResponse(errorText: string): {message: string; errors?: BillitErrorDetail[]} {
    try {
      const parsed = JSON.parse(errorText);
      if (parsed && Array.isArray(parsed.errors) && parsed.errors.length > 0) {
        return {
          message: errorText,
          errors: parsed.errors,
        };
      }
    } catch {
      // Not JSON or doesn't match ErrorsResponse format
    }
    return {message: errorText};
  }

  /**
   * Creates an error with Billit errors attached if present in the response
   */
  static createError(errorText: string, message: string): Error {
    const parsedError = this.parseErrorResponse(errorText);
    const fullMessage = `${message}: ${parsedError.message}`;

    if (parsedError.errors) {
      return new BillitError(fullMessage, parsedError.errors);
    }

    return new Error(fullMessage);
  }
}
