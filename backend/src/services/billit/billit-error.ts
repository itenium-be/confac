import {ErrorsResponse} from './errors/errors.response';

/**
 * Custom error class for Billit API errors with structured error details
 */
export class BillitError extends Error {
  public readonly billitErrors: ErrorsResponse['errors'];

  constructor(message: string, billitErrors: ErrorsResponse['errors']) {
    super(message);
    this.name = 'BillitError';
    this.billitErrors = billitErrors;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BillitError);
    }
  }

  /**
   * Check if this error contains a specific error code (case-insensitive)
   */
  hasErrorCode(code: string): boolean {
    const lowerCode = code.toLowerCase();
    return this.billitErrors.some(err => err.Code.toLowerCase() === lowerCode);
  }
}
