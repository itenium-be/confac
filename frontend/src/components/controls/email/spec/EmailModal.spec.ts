import {getDefaultEmailValue, EmailTemplate} from '../EmailModal';
import InvoiceModel from '../../../invoice/models/InvoiceModel';
import {ConfigModel} from '../../../config/models/ConfigModel';
import {ClientModel} from '../../../client/models/ClientModels';

const buildInvoice = (total: number) => ({
  number: 42,
  money: {total},
  client: {},
  attachments: [],
}) as unknown as InvoiceModel;

const buildClient = () => ({
  email: {to: 'client@acme.be', cc: '', bcc: '', subject: '', body: '', attachments: []},
}) as unknown as ClientModel;

const buildConfig = () => ({
  email: {to: '', cc: '', bcc: '', subject: 'invoice subject', body: 'invoice body', attachments: ['pdf']},
  emailSignature: '',
  emailCreditNotaSubject: 'creditnota subject',
  emailCreditNotaBody: 'creditnota body',
  emailPeppolDuplicateSubject: 'duplicate subject',
  emailPeppolDuplicateBody: 'duplicate body',
}) as unknown as ConfigModel;

describe('getDefaultEmailValue', () => {
  describe('PeppolDuplicate template', () => {
    it('uses the duplicate template for an invoice', () => {
      const email = getDefaultEmailValue(buildInvoice(1210), buildClient(), EmailTemplate.PeppolDuplicate, buildConfig(), []);

      expect(email.subject).toBe('duplicate subject');
      expect(email.body).toBe('duplicate body');
    });

    it('uses the credit note template for a credit note', () => {
      const email = getDefaultEmailValue(buildInvoice(-1210), buildClient(), EmailTemplate.PeppolDuplicate, buildConfig(), []);

      expect(email.subject).toBe('creditnota subject');
      expect(email.body).toBe('creditnota body');
    });
  });

  it('uses the credit note template for a credit note without template', () => {
    const email = getDefaultEmailValue(buildInvoice(-1210), buildClient(), EmailTemplate.None, buildConfig(), []);

    expect(email.subject).toBe('creditnota subject');
    expect(email.body).toBe('creditnota body');
  });
});
