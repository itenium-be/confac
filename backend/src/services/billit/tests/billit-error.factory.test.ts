import {BillitErrorFactory} from '../billit-error.factory';

describe('BillitErrorFactory', () => {
  describe('createError', () => {
    describe('with valid ErrorsResponse format', () => {
      it('should create error with billitErrors when response contains errors array', () => {
        const errorText: string = JSON.stringify({
          errors: [
            {Code: 'ERR001', Description: 'Invalid VAT number'},
            {Code: 'ERR002', Description: 'Missing required field'},
          ],
        });
        const message: string = 'Failed to create order';

        const result: Error = BillitErrorFactory.createError(errorText, message);

        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe(`${message}: ${errorText}`);
        expect((result as Error & {billitErrors?: unknown[]}).billitErrors).toEqual([
          {Code: 'ERR001', Description: 'Invalid VAT number'},
          {Code: 'ERR002', Description: 'Missing required field'},
        ]);
      });

      it('should handle single error in errors array', () => {
        const errorText: string = JSON.stringify({
          errors: [
            {Code: 'ERR001', Description: 'Validation failed'},
          ],
        });
        const message: string = 'Operation failed';

        const result: Error = BillitErrorFactory.createError(errorText, message);

        expect((result as Error & {billitErrors?: unknown[]}).billitErrors).toHaveLength(1);
        expect((result as Error & {billitErrors?: unknown[]}).billitErrors[0]).toEqual({
          Code: 'ERR001',
          Description: 'Validation failed',
        });
      });

      it('should handle errors without Description field', () => {
        const errorText: string = JSON.stringify({
          errors: [
            {Code: 'ERR001'},
            {Code: 'ERR002'},
          ],
        });
        const message: string = 'Operation failed';

        const result: Error = BillitErrorFactory.createError(errorText, message);

        expect((result as Error & {billitErrors?: unknown[]}).billitErrors).toEqual([
          {Code: 'ERR001'},
          {Code: 'ERR002'},
        ]);
      });

      it('should handle empty errors array', () => {
        const errorText: string = JSON.stringify({errors: []});
        const message: string = 'Operation failed';

        const result: Error = BillitErrorFactory.createError(errorText, message);

        expect(result.message).toBe(`${message}: ${errorText}`);
        expect((result as Error & {billitErrors?: unknown[]}).billitErrors).toBeUndefined();
      });
    });

    describe('without ErrorsResponse format', () => {
      it('should create error without billitErrors when response is plain text', () => {
        const errorText: string = 'Internal server error';
        const message: string = 'Failed to send invoice';

        const result: Error = BillitErrorFactory.createError(errorText, message);

        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe(`${message}: ${errorText}`);
        expect((result as Error & {billitErrors?: unknown[]}).billitErrors).toBeUndefined();
      });

      it('should handle JSON without errors field', () => {
        const errorText: string = JSON.stringify({
          message: 'Something went wrong',
          status: 500,
        });
        const message: string = 'Operation failed';

        const result: Error = BillitErrorFactory.createError(errorText, message);

        expect(result.message).toBe(`${message}: ${errorText}`);
        expect((result as Error & {billitErrors?: unknown[]}).billitErrors).toBeUndefined();
      });

      it('should handle JSON with errors field that is not an array', () => {
        const errorText: string = JSON.stringify({errors: 'This is not an array'});
        const message: string = 'Operation failed';

        const result: Error = BillitErrorFactory.createError(errorText, message);

        expect(result.message).toBe(`${message}: ${errorText}`);
        expect((result as Error & {billitErrors?: unknown[]}).billitErrors).toBeUndefined();
      });

      it('should handle malformed JSON', () => {
        const errorText: string = '{invalid json}';
        const message: string = 'Parse error';

        const result: Error = BillitErrorFactory.createError(errorText, message);

        expect(result.message).toBe(`${message}: ${errorText}`);
        expect((result as Error & {billitErrors?: unknown[]}).billitErrors).toBeUndefined();
      });

      it('should handle empty string', () => {
        const errorText: string = '';
        const message: string = 'Empty response';

        const result: Error = BillitErrorFactory.createError(errorText, message);

        expect(result.message).toBe(`${message}: ${errorText}`);
        expect((result as Error & {billitErrors?: unknown[]}).billitErrors).toBeUndefined();
      });

      it('should handle null in JSON', () => {
        const errorText: string = JSON.stringify({errors: null});
        const message: string = 'Operation failed';

        const result: Error = BillitErrorFactory.createError(errorText, message);

        expect((result as Error & {billitErrors?: unknown[]}).billitErrors).toBeUndefined();
      });
    });

    describe('edge cases', () => {
      it('should handle very long error messages', () => {
        const longDescription: string = 'A'.repeat(1000);
        const errorText: string = JSON.stringify({
          errors: [
            {Code: 'ERR001', Description: longDescription},
          ],
        });
        const message: string = 'Operation failed';

        const result: Error = BillitErrorFactory.createError(errorText, message);

        expect((result as Error & {billitErrors?: unknown[]}).billitErrors[0].Description).toBe(longDescription);
      });

      it('should handle special characters in error descriptions', () => {
        const errorText: string = JSON.stringify({
          errors: [
            {Code: 'ERR001', Description: 'Error with "quotes" and \'apostrophes\''},
            {Code: 'ERR002', Description: 'Error with <html> tags'},
            {Code: 'ERR003', Description: 'Error with \n newlines \t and \r tabs'},
          ],
        });
        const message: string = 'Operation failed';

        const result: Error = BillitErrorFactory.createError(errorText, message);

        expect((result as Error & {billitErrors?: unknown[]}).billitErrors).toHaveLength(3);
        expect((result as Error & {billitErrors?: unknown[]}).billitErrors[0].Description).toContain('quotes');
        expect((result as Error & {billitErrors?: unknown[]}).billitErrors[1].Description).toContain('<html>');
      });

      it('should handle errors with additional fields', () => {
        const errorText: string = JSON.stringify({
          errors: [
            {
              Code: 'ERR001',
              Description: 'Validation error',
              Severity: 'High',
              FieldName: 'VATNumber',
              AdditionalInfo: 'Some extra data',
            },
          ],
        });
        const message: string = 'Validation failed';

        const result: Error = BillitErrorFactory.createError(errorText, message);

        expect((result as Error & {billitErrors?: unknown[]}).billitErrors[0]).toEqual({
          Code: 'ERR001',
          Description: 'Validation error',
          Severity: 'High',
          FieldName: 'VATNumber',
          AdditionalInfo: 'Some extra data',
        });
      });

      it('should handle Unicode characters in error messages', () => {
        const errorText: string = JSON.stringify({
          errors: [
            {Code: 'ERR001', Description: 'Erreur avec accents: éàü'},
            {Code: 'ERR002', Description: 'Error with emoji: 🚫'},
            {Code: 'ERR003', Description: 'Chinese characters: 错误'},
          ],
        });
        const message: string = 'Operation failed';

        const result: Error = BillitErrorFactory.createError(errorText, message);

        expect((result as Error & {billitErrors?: unknown[]}).billitErrors).toHaveLength(3);
        expect((result as Error & {billitErrors?: unknown[]}).billitErrors[0].Description).toBe('Erreur avec accents: éàü');
        expect((result as Error & {billitErrors?: unknown[]}).billitErrors[1].Description).toBe('Error with emoji: 🚫');
        expect((result as Error & {billitErrors?: unknown[]}).billitErrors[2].Description).toBe('Chinese characters: 错误');
      });

      it('should handle multiple errors with same code', () => {
        const errorText: string = JSON.stringify({
          errors: [
            {Code: 'ERR001', Description: 'First occurrence'},
            {Code: 'ERR001', Description: 'Second occurrence'},
            {Code: 'ERR001', Description: 'Third occurrence'},
          ],
        });
        const message: string = 'Multiple errors';

        const result: Error = BillitErrorFactory.createError(errorText, message);

        type ErrorWithBillitErrors = Error & {billitErrors?: Array<{Code: string}>};
        const errorWithDetails = result as ErrorWithBillitErrors;
        expect(errorWithDetails.billitErrors).toHaveLength(3);
        expect(errorWithDetails.billitErrors!.every(err => err.Code === 'ERR001')).toBe(true);
      });

      it('should preserve error message format exactly', () => {
        const errorText: string = 'Plain error message';
        const message: string = 'Failed to process';

        const result: Error = BillitErrorFactory.createError(errorText, message);

        expect(result.message).toBe('Failed to process: Plain error message');
      });
    });
  });
});
