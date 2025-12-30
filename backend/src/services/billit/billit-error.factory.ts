import {ErrorsResponse} from './errors/errors.response';

export class BillitErrorFactory {
  /**
   * Parses error response and checks if it contains structured errors
   */
  private static parseErrorResponse(errorText: string): {message: string; errors?: ErrorsResponse['errors']} {
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
    const error: any = new Error(`${message}: ${parsedError.message}`);
    if (parsedError.errors) {
      error.billitErrors = parsedError.errors;
    }
    return error;
  }
}
