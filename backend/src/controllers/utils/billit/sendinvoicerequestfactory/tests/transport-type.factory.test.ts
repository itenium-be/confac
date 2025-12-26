import {fromInvoice} from '../transport-type.factory';
import {TransportType} from '../../../../../services/billit';
import {IInvoice} from '../../../../../models/invoices';
import {someInvoice} from '../../createorderrequestfactory/tests/invoice.fixture';

describe('fromInvoice', () => {
  it('should return Peppol when invoice client is Peppol enabled', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      client: {
        ...someInvoice.client,
        peppolEnabled: true,
      },
    };

    const actual: TransportType = fromInvoice(invoice);

    expect(actual).toBe('Peppol');
  });

  it('should return SMTP when invoice client is not Peppol enabled', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      client: {
        ...someInvoice.client,
        peppolEnabled: false,
      },
    };

    const actual: TransportType = fromInvoice(invoice);

    expect(actual).toBe('SMTP');
  });

  it('should return SMTP when invoice client peppolEnabled is undefined', () => {
    const invoice: IInvoice = {
      ...someInvoice,
      client: {
        ...someInvoice.client,
        peppolEnabled: undefined,
      },
    };

    const actual: TransportType = fromInvoice(invoice);

    expect(actual).toBe('SMTP');
  });
});
