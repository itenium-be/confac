import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {EmailTemplate} from '../../controls/email/EmailModal';
import InvoiceModel from '../models/InvoiceModel';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {ConfacState} from '../../../reducers/app-state';
import {Claim} from '../../users/models/UserModel';
import {EditInvoiceSaveButtons} from './EditInvoiceSaveButtons';
import {createInvoice, previewInvoice, syncCreditNotas, updateInvoiceRequest, sendToPeppol} from '../../../actions';
import {getNewClonedInvoice} from '../models/getNewInvoice';
import {t} from '../../utils';
import {Button} from '../../controls/form-controls/Button';
import {ConfigModel} from '../../config/models/ConfigModel';
import {Modal} from '../../controls/Modal';
import {SignedTimesheetAttachmentType} from '../../../models';
import {ClientModel} from '../../client/models/ClientModels';

function shouldUsePeppol(invoice: InvoiceModel, config: ConfigModel): boolean {
  const invoiceCreatedOn = moment(invoice.audit.createdOn);
  return invoiceCreatedOn.isSameOrAfter(config.peppolPivotDate, 'day');
}


type PeppolModalProps = {
  invoice: InvoiceModel;
  client: ClientModel | undefined;
  onClose: () => void;
  onConfirm: () => void;
}

const PeppolModal = ({invoice, client, onClose, onConfirm}: PeppolModalProps) => {
  const hasSignedTimesheet = invoice.attachments.some(a => a.type === SignedTimesheetAttachmentType);
  const isPeppolEnabled = client?.peppolEnabled === true;

  return (
    <Modal
      show
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={t('invoice.peppolSend')}
      title={t('invoice.peppolSend')}
    >
      {invoice.billitOrderId && (
        <p><strong>{t('invoice.peppolBillitOrderId')}:</strong> {invoice.billitOrderId}</p>
      )}
      <p>
        <strong>{t('invoice.peppolSignedTimesheet')}:</strong>{' '}
        {hasSignedTimesheet ? t('yes') : t('no')}
      </p>
      <p>
        <strong>{t('invoice.peppolTransportType')}:</strong>{' '}
        {isPeppolEnabled ? 'Peppol' : 'Email'}
        {!isPeppolEnabled && (
          <><br /><strong>{t('invoice.peppolEmailTo')}:</strong> {client?.email?.to}</>
        )}
      </p>
      <hr />
      <p>{t('invoice.peppolConfirmSend')}</p>
    </Modal>
  );
};


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
  const [peppolModalOpen, setPeppolModalOpen] = useState(false);

  const alreadySentToPeppol = !!invoice.lastEmail;

  return (
    <>
      {peppolModalOpen && (
        <PeppolModal
          invoice={invoice}
          client={clients.find(c => c._id === invoice.client._id)}
          onClose={() => setPeppolModalOpen(false)}
          onConfirm={() => dispatch(sendToPeppol(invoice._id) as any)}
        />
      )}
      {!invoice.isNew && invoice.client && shouldUsePeppol(invoice, config) && (
        <Button
          claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.EmailInvoices}
          variant="light"
          icon="fas fa-paper-plane"
          onClick={() => setPeppolModalOpen(true)}
          className="tst-send-peppol"
          disabled={alreadySentToPeppol}
          title={alreadySentToPeppol ? `${t('invoice.peppolAlreadySent')} (Id=${invoice.billitOrderId})` : undefined}
        >
          {t('invoice.peppolSend')}
        </Button>
      )}
      {!invoice.isNew && invoice.client && !shouldUsePeppol(invoice, config) && (
        <>
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
