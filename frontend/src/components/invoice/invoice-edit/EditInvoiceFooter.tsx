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
import {getInvoiceFileName} from '../../../actions/utils/download-helpers';
import {Icon} from '../../controls/Icon';

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
  const isPeppolEnabled = !!client?.peppolEnabled;
  const alreadySent = !!invoice.lastEmail;

  let transportType = isPeppolEnabled ? 'Peppol' : 'Email';
  if (client?.peppolEnabled === undefined) {
    transportType = '???';
  }

  return (
    <Modal
      show
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={t('invoice.peppolSend')}
      title={t('invoice.peppolSend')}
    >
      {alreadySent && (
        <p style={{marginBottom: 0}}><strong>{t('invoice.peppolSentOn')}:</strong> {moment(invoice.lastEmail).format('DD/MM/YYYY HH:mm')}</p>
      )}
      {invoice.billit?.orderId && (
        <p><strong>{t('invoice.peppolBillitOrderId')}:</strong> {invoice.billit?.orderId}</p>
      )}
      <p>
        <strong>{t('invoice.peppolSignedTimesheet')}:</strong>{' '}
        <Icon
          fa={hasSignedTimesheet ? 'fa fa-check' : 'fa fa-times'}
          color={hasSignedTimesheet ? 'green' : 'red'}
          size={1}
        />
      </p>
      <p>
        <strong>{t('invoice.peppolTransportType')}:</strong>{' '}
        {transportType}
        {transportType === 'Email' && (
          <><br /><strong>{t('invoice.peppolEmailTo')}:</strong> {client?.email?.to}</>
        )}
      </p>
      <hr />
      {t('invoice.peppolConfirmSend')}
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

  return (
    <>
      {peppolModalOpen && (
        <PeppolModal
          invoice={invoice}
          client={clients.find(c => c._id === invoice.client._id)}
          onClose={() => setPeppolModalOpen(false)}
          onConfirm={() => {
            const fileNameTemplate = invoice.client.invoiceFileName || config.invoiceFileName;
            const pdfFileName = getInvoiceFileName(fileNameTemplate, invoice, 'pdf');
            dispatch(sendToPeppol(invoice._id, pdfFileName) as any);
          }}
        />
      )}
      {!invoice.isNew && invoice.client && shouldUsePeppol(invoice, config) && (
        <Button
          claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.EmailInvoices}
          variant={invoice.lastEmail ? 'outline-danger' : 'light'}
          icon="fas fa-paper-plane"
          onClick={() => setPeppolModalOpen(true)}
          className="tst-send-peppol"
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
