import {BillitError, BillitErrorDetail} from '../billit-error';

describe('BillitError', () => {
  describe('constructor', () => {
    it('should create a BillitError instance with message and errors', () => {
      const message: string = 'Failed to create order';
      const errors: BillitErrorDetail[] = [
        {Code: 'ERR001', Description: 'Invalid VAT number'},
        {Code: 'ERR002', Description: 'Missing required field'},
      ];

      const billitError: BillitError = new BillitError(message, errors);

      expect(billitError).toBeInstanceOf(BillitError);
      expect(billitError).toBeInstanceOf(Error);
      expect(billitError.message).toBe(message);
      expect(billitError.billitErrors).toEqual(errors);
    });

    it('should set the error name to "BillitError"', () => {
      const billitError: BillitError = new BillitError('Test error', []);

      expect(billitError.name).toBe('BillitError');
    });

    it('should handle single error in array', () => {
      const errors: BillitErrorDetail[] = [
        {Code: 'ERR001', Description: 'Single error'},
      ];

      const billitError: BillitError = new BillitError('Error occurred', errors);

      expect(billitError.billitErrors).toHaveLength(1);
      expect(billitError.billitErrors[0]).toEqual({Code: 'ERR001', Description: 'Single error'});
    });

    it('should handle empty errors array', () => {
      const errors: BillitErrorDetail[] = [];

      const billitError: BillitError = new BillitError('Error with no details', errors);

      expect(billitError.billitErrors).toEqual([]);
      expect(billitError.billitErrors).toHaveLength(0);
    });

    it('should handle errors without Description field', () => {
      const errors: BillitErrorDetail[] = [
        {Code: 'ERR001'},
        {Code: 'ERR002'},
      ];

      const billitError: BillitError = new BillitError('Error occurred', errors);

      expect(billitError.billitErrors).toEqual([
        {Code: 'ERR001'},
        {Code: 'ERR002'},
      ]);
    });
  });

  describe('Error inheritance', () => {
    it('should be catchable as Error', () => {
      const billitError: BillitError = new BillitError('Test', [{Code: 'ERR001'}]);

      try {
        throw billitError;
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(BillitError);
      }
    });

    it('should have a stack trace', () => {
      const billitError: BillitError = new BillitError('Test', [{Code: 'ERR001'}]);

      expect(billitError.stack).toBeDefined();
      expect(billitError.stack).toContain('BillitError');
    });

    it('should preserve stack trace when thrown', () => {
      let caughtError: any;

      try {
        throw new BillitError('Test error', [{Code: 'ERR001'}]);
      } catch (error) {
        caughtError = error;
      }

      expect(caughtError.stack).toBeDefined();
      expect(caughtError.stack).toContain('billit-error.test.ts');
    });
  });

  describe('instanceof checks', () => {
    it('should return true for instanceof BillitError', () => {
      const billitError: BillitError = new BillitError('Test', [{Code: 'ERR001'}]);

      expect(billitError instanceof BillitError).toBe(true);
    });

    it('should return true for instanceof Error', () => {
      const billitError: BillitError = new BillitError('Test', [{Code: 'ERR001'}]);

      expect(billitError instanceof Error).toBe(true);
    });

    it('should distinguish BillitError from regular Error', () => {
      const regularError: Error = new Error('Regular error');
      const billitError: BillitError = new BillitError('Billit error', [{Code: 'ERR001'}]);

      expect(regularError instanceof BillitError).toBe(false);
      expect(billitError instanceof BillitError).toBe(true);
    });
  });

  describe('billitErrors property', () => {
    it('should have billitErrors property', () => {
      const errors: BillitErrorDetail[] = [{Code: 'ERR001'}];
      const billitError: BillitError = new BillitError('Test', errors);

      // TypeScript enforces readonly at compile-time
      expect(billitError.billitErrors).toBe(errors);
      expect(Object.prototype.hasOwnProperty.call(billitError, 'billitErrors')).toBe(true);
    });

    it('should preserve error array reference', () => {
      const errors: BillitErrorDetail[] = [
        {Code: 'ERR001', Description: 'First error'},
        {Code: 'ERR002', Description: 'Second error'},
      ];

      const billitError: BillitError = new BillitError('Test', errors);

      expect(billitError.billitErrors).toBe(errors);
    });

    it('should handle errors with additional properties', () => {
      const errors: any[] = [
        {
          Code: 'ERR001',
          Description: 'Validation error',
          Severity: 'High',
          FieldName: 'VATNumber',
        },
      ];

      const billitError: BillitError = new BillitError('Validation failed', errors);

      expect(billitError.billitErrors[0]).toEqual({
        Code: 'ERR001',
        Description: 'Validation error',
        Severity: 'High',
        FieldName: 'VATNumber',
      });
    });
  });

  describe('message property', () => {
    it('should preserve the exact message', () => {
      const message: string = 'Failed to send invoice via Peppol';

      const billitError: BillitError = new BillitError(message, [{Code: 'ERR001'}]);

      expect(billitError.message).toBe(message);
    });

    it('should handle empty message', () => {
      const billitError: BillitError = new BillitError('', [{Code: 'ERR001'}]);

      expect(billitError.message).toBe('');
    });

    it('should handle very long messages', () => {
      const longMessage: string = `Error: ${'A'.repeat(1000)}`;

      const billitError: BillitError = new BillitError(longMessage, [{Code: 'ERR001'}]);

      expect(billitError.message).toBe(longMessage);
    });

    it('should handle messages with special characters', () => {
      const message: string = 'Error with "quotes" and \'apostrophes\' and\nnewlines';

      const billitError: BillitError = new BillitError(message, [{Code: 'ERR001'}]);

      expect(billitError.message).toBe(message);
    });
  });

  describe('edge cases', () => {
    it('should handle Unicode in error descriptions', () => {
      const errors: BillitErrorDetail[] = [
        {Code: 'ERR001', Description: 'Erreur avec accents: éàü'},
        {Code: 'ERR002', Description: 'Error with emoji: 🚫'},
        {Code: 'ERR003', Description: 'Chinese characters: 错误'},
      ];

      const billitError: BillitError = new BillitError('International errors', errors);

      expect(billitError.billitErrors[0].Description).toBe('Erreur avec accents: éàü');
      expect(billitError.billitErrors[1].Description).toBe('Error with emoji: 🚫');
      expect(billitError.billitErrors[2].Description).toBe('Chinese characters: 错误');
    });

    it('should handle large error arrays', () => {
      const errors: BillitErrorDetail[] = Array.from({length: 100}, (_, i) => ({
        Code: `ERR${String(i).padStart(3, '0')}`,
        Description: `Error number ${i}`,
      }));

      const billitError: BillitError = new BillitError('Multiple errors', errors);

      expect(billitError.billitErrors).toHaveLength(100);
      expect(billitError.billitErrors[0].Code).toBe('ERR000');
      expect(billitError.billitErrors[99].Code).toBe('ERR099');
    });

    it('should handle errors with same code', () => {
      const errors: BillitErrorDetail[] = [
        {Code: 'ERR001', Description: 'First occurrence'},
        {Code: 'ERR001', Description: 'Second occurrence'},
        {Code: 'ERR001', Description: 'Third occurrence'},
      ];

      const billitError: BillitError = new BillitError('Duplicate error codes', errors);

      expect(billitError.billitErrors).toHaveLength(3);
      expect(billitError.billitErrors.every(err => err.Code === 'ERR001')).toBe(true);
    });
  });

  describe('serialization', () => {
    it('should be JSON serializable', () => {
      const errors: BillitErrorDetail[] = [
        {Code: 'ERR001', Description: 'Test error'},
      ];
      const billitError: BillitError = new BillitError('Test message', errors);

      const serialized: string = JSON.stringify(billitError);
      const parsed: any = JSON.parse(serialized);

      // Note: JSON.stringify on Error objects doesn't include message by default
      // but custom properties like billitErrors are included
      expect(parsed.billitErrors).toEqual(errors);
    });

    it('should include billitErrors when converting to object', () => {
      const errors: BillitErrorDetail[] = [
        {Code: 'ERR001', Description: 'Test error'},
      ];
      const billitError: BillitError = new BillitError('Test message', errors);

      const errorObject: any = {
        message: billitError.message,
        name: billitError.name,
        billitErrors: billitError.billitErrors,
      };

      expect(errorObject).toEqual({
        message: 'Test message',
        name: 'BillitError',
        billitErrors: errors,
      });
    });
  });

  describe('toString', () => {
    it('should return a string representation', () => {
      const billitError: BillitError = new BillitError('Test error', [{Code: 'ERR001'}]);

      const stringRep: string = billitError.toString();

      expect(stringRep).toContain('BillitError');
      expect(stringRep).toContain('Test error');
    });
  });

  describe('isIdempotentTokenAlreadyExistsError', () => {
    it('should return true when error contains idempotent token error code', () => {
      const billitError: BillitError = new BillitError('Test error', [
        {Code: 'Idempotent token already exists'},
      ]);

      expect(billitError.isIdempotentTokenAlreadyExistsError()).toBe(true);
    });

    it('should return true with case variations', () => {
      const billitError: BillitError = new BillitError('Test error', [
        {Code: 'IDEMPOTENT TOKEN ALREADY EXISTS'},
      ]);

      expect(billitError.isIdempotentTokenAlreadyExistsError()).toBe(true);
    });

    it('should return false when error does not contain idempotent token error code', () => {
      const billitError: BillitError = new BillitError('Test error', [
        {Code: 'ERR001', Description: 'Different error'},
        {Code: 'ERR002', Description: 'Another error'},
      ]);

      expect(billitError.isIdempotentTokenAlreadyExistsError()).toBe(false);
    });

    it('should return false when errors array is empty', () => {
      const billitError: BillitError = new BillitError('Test error', []);

      expect(billitError.isIdempotentTokenAlreadyExistsError()).toBe(false);
    });

    it('should return true when idempotent error is among other errors', () => {
      const billitError: BillitError = new BillitError('Test error', [
        {Code: 'ERR001', Description: 'First error'},
        {Code: 'Idempotent token already exists'},
        {Code: 'ERR003', Description: 'Third error'},
      ]);

      expect(billitError.isIdempotentTokenAlreadyExistsError()).toBe(true);
    });
  });
});
