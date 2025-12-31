import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {EmailTemplate} from '../../controls/email/EmailModal';
import InvoiceModel from '../models/InvoiceModel';
import {ConfacState} from '../../../reducers/app-state';
import {Claim} from '../../users/models/UserModel';
import {EditInvoiceSaveButtons} from './EditInvoiceSaveButtons';
import {createInvoice, previewInvoice, syncCreditNotas, updateInvoiceRequest,
  sendToPeppol, refreshPeppolStatus, syncClientPeppolStatus} from '../../../actions';
import {getNewClonedInvoice} from '../models/getNewInvoice';
import {t} from '../../utils';
import {Button} from '../../controls/form-controls/Button';
import {ConfigModel} from '../../config/models/ConfigModel';
import {getInvoiceFileName} from '../../../actions/utils/download-helpers';
import {SendToPeppolModal, PeppolStatusModal} from '../controls/PeppolModal';

function shouldUsePeppol(invoice: InvoiceModel, config: ConfigModel): boolean {
  const invoiceCreatedOn = moment(invoice.audit.createdOn);
  return invoiceCreatedOn.isSameOrAfter(config.peppolPivotDate, 'day');
}


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
  const [showSendModal, setShowSendModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const isSentStatus = invoice.status === 'ToPay' || invoice.status === 'Paid';

  return (
    <>
      {showSendModal && (
        <SendToPeppolModal
          invoice={invoice}
          client={clients.find(c => c._id === invoice.client._id)}
          onClose={() => setShowSendModal(false)}
          onConfirm={() => {
            const fileNameTemplate = invoice.client.invoiceFileName || config.invoiceFileName;
            const pdfFileName = getInvoiceFileName(fileNameTemplate, invoice, 'pdf');
            dispatch(sendToPeppol(invoice._id, pdfFileName) as any);
            setShowSendModal(false);
          }}
        />
      )}
      {showStatusModal && (
        <PeppolStatusModal
          invoice={invoice}
          onClose={() => setShowStatusModal(false)}
          onRefresh={() => {
            dispatch(refreshPeppolStatus(invoice._id) as any);
          }}
        />
      )}
      {!invoice.isNew && invoice.client && shouldUsePeppol(invoice, config) && !isSentStatus && (
        <Button
          claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.EmailInvoices}
          variant="light"
          icon="fas fa-paper-plane"
          onClick={() => {
            dispatch(syncClientPeppolStatus(invoice.client._id) as any);
            setShowSendModal(true);
          }}
          className="tst-send-peppol"
        >
          {t('invoice.peppolSend')}
        </Button>
      )}
      {!invoice.isNew && invoice.client && shouldUsePeppol(invoice, config) && isSentStatus && (
        <Button
          claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.EmailInvoices}
          variant="light"
          icon="fas fa-paper-plane"
          onClick={() => setShowStatusModal(true)}
          className="tst-peppol-status"
        >
          {t('invoice.peppolStatus')}
        </Button>
      )}
      {!invoice.isNew && invoice.client && !shouldUsePeppol(invoice, config) && (
        <>
          <Button
            claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.EmailInvoices}
            variant={invoice?.status === 'Paid' || invoice?.lastEmail ? 'outline-danger' : 'light'}
            icon="far fa-envelope"
            onClick={() => setEmailModal(EmailTemplate.InitialEmail)}
            className="tst-open-email-initial"
          >
            {t('email.prepareEmail')}
          </Button>
          <Button
            claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.EmailInvoices}
            variant={invoice?.status === 'Paid' || !invoice?.lastEmail ? 'outline-danger' : 'light'}
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
