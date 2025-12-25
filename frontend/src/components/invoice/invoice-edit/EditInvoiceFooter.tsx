import {useDispatch} from 'react-redux';
import {EmailTemplate} from '../../controls/email/EmailModal';
import InvoiceModel from '../models/InvoiceModel';
import {useSelector} from 'react-redux';
import {ConfacState} from '../../../reducers/app-state';
import {Claim} from '../../users/models/UserModel';
import {EditInvoiceSaveButtons} from './EditInvoiceSaveButtons';
import {createInvoice, previewInvoice, syncCreditNotas, updateInvoiceRequest, sendToPeppol} from '../../../actions';
import {getNewClonedInvoice} from '../models/getNewInvoice';
import {t} from '../../utils';
import {Button} from '../../controls/form-controls/Button';


export type EditInvoiceFooterProps = {
  initInvoice: InvoiceModel;
  invoice: InvoiceModel;
  setEmailModal: (emailTemplate: EmailTemplate) => void;
  acceptChanges: () => void;
}


export const EditInvoiceFooter = ({invoice, initInvoice, setEmailModal, acceptChanges}: EditInvoiceFooterProps) => {
  const dispatch = useDispatch();
  const invoices = useSelector((state: ConfacState) => state.invoices);
  const config = useSelector((state: ConfacState) => state.config);
  const clients = useSelector((state: ConfacState) => state.clients);

  return (
    <>
      {!invoice.isNew && invoice.client && (
        <>
          <Button
            claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.EmailInvoices}
            variant="light"
            icon="fas fa-paper-plane"
            onClick={() => dispatch(sendToPeppol(invoice._id) as any)}
            className="tst-send-peppol"
          >
            {t('invoice.peppolSend')}
          </Button>
          <Button
            claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.EmailInvoices}
            variant={invoice?.verified || invoice?.lastEmail ? 'outline-danger' : 'light'}
            icon="far fa-envelope"
            onClick={() => setEmailModal(EmailTemplate.InitialEmail)}
            className="tst-open-email-initial"
          >
            {t('email.prepareEmail')}
          </Button>
          <Button
            claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.EmailInvoices}
            variant={invoice?.verified || !invoice?.lastEmail ? 'outline-danger' : 'light'}
            icon="far fa-envelope"
            onClick={() => setEmailModal(EmailTemplate.Reminder)}
            className="tst-open-email-reminder"
          >
            {t('email.prepareEmailReminder')}
          </Button>
        </>
      )}
      <EditInvoiceSaveButtons
        invoice={invoice}
        onClick={(type, navigate) => {
          if (type === 'create') {
            acceptChanges();
            dispatch(createInvoice(invoice, navigate) as any);
          } if (type === 'preview') {
            dispatch(previewInvoice(invoice.client.invoiceFileName || config.invoiceFileName, invoice) as any);
          } if (type === 'update') {
            dispatch(syncCreditNotas(invoice, initInvoice.creditNotas, invoices) as any);
            dispatch(updateInvoiceRequest(invoice, undefined, false, navigate) as any);
          } if (type === 'clone') {
            const creditNota = getNewClonedInvoice(invoices, invoice, clients);
            navigate(`/invoices/${creditNota.number}`);
            dispatch(createInvoice(creditNota) as any);
          }
        }}
      />
    </>
  );
};
