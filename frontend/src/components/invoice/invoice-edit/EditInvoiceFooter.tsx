import {useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router';
import moment from 'moment';
import {EmailTemplate} from '../../controls/email/EmailModal';
import InvoiceModel from '../models/InvoiceModel';
import {ConfacState} from '../../../reducers/app-state';
import {Claim} from '../../users/models/UserModel';
import {EditInvoiceSaveButtons} from './EditInvoiceSaveButtons';
import {createInvoice, previewInvoice, syncCreditNotas, updateInvoiceRequest,
  sendToPeppol, refreshPeppolStatus, syncClientPeppolStatus, deleteInvoice} from '../../../actions';
import {getNewClonedInvoice} from '../models/getNewInvoice';
import {t} from '../../utils';
import {Button} from '../../controls/form-controls/Button';
import {BusyButton} from '../../controls/form-controls/BusyButton';
import {ConfigModel} from '../../config/models/ConfigModel';
import {getInvoiceFileName} from '../../../actions/utils/download-helpers';
import {SendToPeppolModal, PeppolStatusModal} from '../controls/PeppolModal';
import {Popup, PopupButton} from '../../controls/Popup';
import {useAppDispatch} from '../../hooks/useAppDispatch';

function shouldUsePeppol(invoice: InvoiceModel, config: ConfigModel): boolean {
  const invoiceCreatedOn = moment(invoice.audit.createdOn);
  return invoiceCreatedOn.isSameOrAfter(config.peppolPivotDate, 'day');
}


export type EditInvoiceFooterProps = {
  initInvoice: InvoiceModel;
  invoice: InvoiceModel;
  hasChanges: boolean;
  setEmailModal: (emailTemplate: EmailTemplate) => void;
  acceptChanges: () => void;
}


export const EditInvoiceFooter = ({invoice, initInvoice, hasChanges, setEmailModal, acceptChanges}: EditInvoiceFooterProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const invoices = useSelector((state: ConfacState) => state.invoices);
  const config = useSelector((state: ConfacState) => state.config);
  const clients = useSelector((state: ConfacState) => state.clients);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSaveFirstModal, setShowSaveFirstModal] = useState(false);

  const isSentStatus = invoice.status === 'ToPay' || invoice.status === 'Paid';

  // Check if this invoice can be deleted (highest number and Draft status)
  const nonQuotationInvoices = invoices.filter(i => !i.isQuotation);
  const highestInvoiceNumber = nonQuotationInvoices.length > 0
    ? Math.max(...nonQuotationInvoices.map(i => i.number))
    : 0;
  const canDeleteInvoice = !invoice.isQuotation
    && invoice.status === 'Draft'
    && invoice.number === highestInvoiceNumber
    && !invoice.isNew;

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
            dispatch(sendToPeppol(invoice._id, pdfFileName));
            setShowSendModal(false);
          }}
        />
      )}
      {showStatusModal && (
        <PeppolStatusModal
          invoice={invoice}
          onClose={() => setShowStatusModal(false)}
          onRefresh={() => {
            dispatch(refreshPeppolStatus(invoice._id));
          }}
        />
      )}
      {showDeleteModal && (
        <Popup
          title={t('invoice.deleteTitle')}
          buttons={[
            {text: t('no'), onClick: () => setShowDeleteModal(false), variant: 'light'},
            {
              text: t('delete'),
              variant: 'danger',
              onClick: () => {
                setShowDeleteModal(false);
                dispatch(deleteInvoice(invoice));
                navigate('/invoices');
              },
            },
          ] as PopupButton[]}
          onHide={() => setShowDeleteModal(false)}
        >
          {t('invoice.deletePopup', {number: invoice.number, client: invoice.client.name})}
        </Popup>
      )}
      {showSaveFirstModal && (
        <Popup
          title={t('invoice.peppolSaveFirstTitle')}
          buttons={[
            {text: t('close'), onClick: () => setShowSaveFirstModal(false), variant: 'light'},
            {
              text: t('save'),
              onClick: () => {
                dispatch(syncCreditNotas(invoice, initInvoice.creditNotas, invoices));
                dispatch(updateInvoiceRequest(invoice, undefined, false));
                acceptChanges();
                setShowSaveFirstModal(false);
                const client = clients.find(c => c._id === invoice.client._id);
                if (client?.peppolEnabled !== true) {
                  dispatch(syncClientPeppolStatus(invoice.client._id));
                }
                setShowSendModal(true);
              },
              variant: 'primary',
            },
          ] as PopupButton[]}
          onHide={() => setShowSaveFirstModal(false)}
        >
          {t('invoice.peppolSaveFirstMessage')}
        </Popup>
      )}
      {canDeleteInvoice && (
        <BusyButton
          claim={Claim.ManageInvoices}
          variant="danger"
          icon="fa fa-trash"
          onClick={() => setShowDeleteModal(true)}
          className="tst-delete-invoice"
        >
          {t('delete')}
        </BusyButton>
      )}
      {!invoice.isNew && invoice.client && shouldUsePeppol(invoice, config) && !isSentStatus && (
        <BusyButton
          claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.EmailInvoices}
          variant="light"
          icon="fas fa-paper-plane"
          onClick={() => {
            if (hasChanges) {
              setShowSaveFirstModal(true);
              return;
            }
            const client = clients.find(c => c._id === invoice.client._id);
            if (client?.peppolEnabled !== true) {
              dispatch(syncClientPeppolStatus(invoice.client._id));
            }
            setShowSendModal(true);
          }}
          className="tst-send-peppol"
        >
          {t('invoice.peppolSend')}
        </BusyButton>
      )}
      {!invoice.isNew && invoice.client && shouldUsePeppol(invoice, config) && isSentStatus && (
        <>
          <Button
            claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.EmailInvoices}
            variant="light"
            icon="fas fa-paper-plane"
            onClick={() => setShowStatusModal(true)}
            className="tst-peppol-status"
          >
            {t('invoice.peppolStatus')}
          </Button>
          <Button
            claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.EmailInvoices}
            variant="light"
            icon="far fa-envelope"
            onClick={() => setEmailModal(EmailTemplate.PeppolDuplicate)}
            className="tst-open-email-peppol-duplicate"
          >
            {t('email.preparePeppolDuplicate')}
          </Button>
        </>
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
        onClick={(type, nav) => {
          if (type === 'create') {
            acceptChanges();
            dispatch(createInvoice(invoice, nav));
          } if (type === 'preview') {
            dispatch(previewInvoice(invoice.client.invoiceFileName || config.invoiceFileName, invoice));
          } if (type === 'update') {
            dispatch(syncCreditNotas(invoice, initInvoice.creditNotas, invoices));
            dispatch(updateInvoiceRequest(invoice, undefined, false, nav));
          } if (type === 'clone') {
            const creditNota = getNewClonedInvoice(invoices, invoice, clients);
            nav(`/invoices/${creditNota.number}`);
            dispatch(createInvoice(creditNota));
          }
        }}
      />
    </>
  );
};
