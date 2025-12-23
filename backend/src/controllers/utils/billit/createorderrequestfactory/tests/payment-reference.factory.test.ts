import {fromInvoice} from '../payment-reference.factory';
import {IInvoice} from '../../../../../models/invoices';
import {someInvoice} from './invoice.fixture';

describe('fromInvoice', () => {
  it('should create payment reference for standard invoice number', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      number: 2024001,
    };
    const expected: string = '+++000/2024/00196+++';

    const actual: string = fromInvoice(invoice);

    expect(actual).toBe(expected);
  });

  it('should pad small invoice numbers with leading zeros', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      number: 1,
    };
    const expected: string = '+++000/0000/00101+++';

    const actual: string = fromInvoice(invoice);

    expect(actual).toBe(expected);
  });

  it('should handle large invoice number', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      number: 9999999999,
    };
    const expected: string = '+++999/9999/99948+++';

    const actual: string = fromInvoice(invoice);

    expect(actual).toBe(expected);
  });

  it('should handle invoice number 0 with correct check digits', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      number: 0,
    };
    const expected: string = '+++000/0000/00000+++';

    const actual: string = fromInvoice(invoice);

    expect(actual).toBe(expected);
  });

  it('should correctly calculate modulo 97 check digits', () => {
    // For number 2024002, modulo 97 should be calculated correctly
    // 2024002 % 97 = 0, so check digits should be '00'
    const invoice: IInvoice = {
      ...someInvoice,
      number: 2024002,
    };
    const expected: string = '+++000/2024/00200+++';

    const actual: string = fromInvoice(invoice);

    expect(actual).toBe(expected);
  });

  it('should format reference with correct structure (+++nnn/nnnn/nnnnn+++)', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      number: 12345678,
    };

    const actual: string = fromInvoice(invoice);

    // Verify format: +++nnn/nnnn/nnnnn+++
    expect(actual).toMatch(/^\+\+\+\d{3}\/\d{4}\/\d{5}\+\+\+$/);
  });
});
