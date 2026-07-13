import {IInvoiceBillitError} from '../../../models/invoices';
import {BillitError} from '../billit-error';
import {BillitErrorFactory} from '../billit-error.factory';

describe('BillitErrorFactory.toInvoiceError', () => {
  it('maps a BillitError including its structured error codes', () => {
    const billitErrors = [{
      Code: 'PleaseSupplyAValidPONumberInTheFieldYourReference',
      Description: 'Voor deze klant is een geldig PO of ordernummer nodig in het veld Uw referentie.',
    }];
    const error = new BillitError('Failed to send invoice via Peppol: {"errors":[...]}', billitErrors);

    const result: IInvoiceBillitError = BillitErrorFactory.toInvoiceError('sendInvoice', error);

    expect(result.operation).toBe('sendInvoice');
    expect(result.message).toBe('Failed to send invoice via Peppol: {"errors":[...]}');
    expect(result.billitErrors).toEqual(billitErrors);
  });

  it('maps a plain Error without billitErrors', () => {
    const result: IInvoiceBillitError = BillitErrorFactory.toInvoiceError('createOrder', new Error('Billit is down'));

    expect(result.operation).toBe('createOrder');
    expect(result.message).toBe('Billit is down');
    expect(result.billitErrors).toBeUndefined();
  });

  it('maps a non-Error throwable to its string representation', () => {
    const result: IInvoiceBillitError = BillitErrorFactory.toInvoiceError('sendInvoice', 'boom');

    expect(result.message).toBe('boom');
    expect(result.billitErrors).toBeUndefined();
  });

  it('stamps the error with the current date as an ISO string', () => {
    const before = new Date().toISOString();

    const result: IInvoiceBillitError = BillitErrorFactory.toInvoiceError('sendInvoice', new Error('nope'));

    expect(result.date >= before).toBe(true);
    expect(result.date <= new Date().toISOString()).toBe(true);
  });
});
