import {fromClient} from '../vat-number.factory';
import {IClient} from '../../../../models/clients';
import {someClient} from './client.fixture';

describe('fromClient', () => {
  it('should remove spaces and dots from VAT number', () => {
    const client: IClient = {
      ...someClient,
      btw: 'BE 0123.456.789',
    };
    const expected: string = 'BE0123456789';

    const actual: string = fromClient(client);

    expect(actual).toBe(expected);
  });

  it('should return VAT number unchanged when no spaces or dots', () => {
    const client: IClient = {
      ...someClient,
      btw: 'BE0123456789',
    };
    const expected: string = 'BE0123456789';

    const actual: string = fromClient(client);

    expect(actual).toBe(expected);
  });

  it('should remove only spaces from VAT number', () => {
    const client: IClient = {
      ...someClient,
      btw: 'BE 0123 456 789',
    };
    const expected: string = 'BE0123456789';

    const actual: string = fromClient(client);

    expect(actual).toBe(expected);
  });

  it('should remove only dots from VAT number', () => {
    const client: IClient = {
      ...someClient,
      btw: 'BE.0123.456.789',
    };
    const expected: string = 'BE0123456789';

    const actual: string = fromClient(client);

    expect(actual).toBe(expected);
  });

  it('should handle VAT number with mixed formatting', () => {
    const client: IClient = {
      ...someClient,
      btw: 'NL 123.456.789.B01',
    };
    const expected: string = 'NL123456789B01';

    const actual: string = fromClient(client);

    expect(actual).toBe(expected);
  });

  it('should handle VAT number with multiple consecutive spaces and dots', () => {
    const client: IClient = {
      ...someClient,
      btw: 'FR  12..345..678  901',
    };
    const expected: string = 'FR12345678901';

    const actual: string = fromClient(client);

    expect(actual).toBe(expected);
  });

  it('should handle empty VAT number', () => {
    const client: IClient = {
      ...someClient,
      btw: '',
    };
    const expected: string = '';

    const actual: string = fromClient(client);

    expect(actual).toBe(expected);
  });
});
