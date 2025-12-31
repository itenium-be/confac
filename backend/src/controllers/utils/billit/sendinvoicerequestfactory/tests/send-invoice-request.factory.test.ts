import {fromInvoice} from '../send-invoice-request.factory';
import {SendInvoiceRequest} from '../../../../../services/billit';
import {IInvoice} from '../../../../../models/invoices';
import {someClient, someInvoice} from '../../createorderrequestfactory/tests/invoice.fixture';

describe('fromInvoice', () => {
  it('should create SendInvoiceRequest with transport type Peppol when client is Peppol enabled', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      number: 2024001,
      billit: {orderId: 12345},
    };

    const expected: SendInvoiceRequest = {
      TransportType: 'Peppol',
      OrderIDs: [12345],
    };

    const actual: SendInvoiceRequest = fromInvoice(invoice, {...someClient, peppolEnabled: true});

    expect(actual).toEqual(expected);
  });

  it('should create SendInvoiceRequest with transport type SMTP when client is not Peppol enabled', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      number: 2024002,
      billit: {orderId: 67890},
      client: {
        ...someInvoice.client,
        peppolEnabled: false,
      },
    };

    const expected: SendInvoiceRequest = {
      TransportType: 'SMTP',
      OrderIDs: [67890],
    };

    const actual: SendInvoiceRequest = fromInvoice(invoice, {...someClient, peppolEnabled: false});

    expect(actual).toEqual(expected);
  });

  it('should create SendInvoiceRequest with transport type SMTP when client Peppol enabled is undefined', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      number: 2024002,
      billit: {orderId: 67890},
      client: {
        ...someInvoice.client,
        peppolEnabled: undefined,
      },
    };

    const expected: SendInvoiceRequest = {
      TransportType: 'SMTP',
      OrderIDs: [67890],
    };

    const actual: SendInvoiceRequest = fromInvoice(invoice, someClient);

    expect(actual).toEqual(expected);
  });

  it('should throw error when billit.orderId is not present', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      number: 2024003,
      billit: {orderId: undefined},
    };

    expect(() => fromInvoice(invoice, someClient)).toThrow(
      'Billit order id is not present on invoice 2024003.',
    );
  });
});
