import moment from 'moment';
import {t} from '../../utils';
import {Modal} from '../../controls/Modal';
import {Icon} from '../../controls/Icon';
import {SignedTimesheetAttachmentType} from '../../../models';
import {ClientModel} from '../../client/models/ClientModels';
import InvoiceModel, {InvoiceBillitDeliveryDetails, InvoiceBillitMessage} from '../models/InvoiceModel';


const BillitOrderInfo = ({invoice}: {invoice: InvoiceModel}) => (
  <>
    {invoice.lastEmail && (
      <p style={{marginBottom: 0}}><strong>{t('invoice.peppolSentOn')}:</strong> {moment(invoice.lastEmail).format('DD/MM/YYYY HH:mm')}</p>
    )}
    {invoice.billit?.orderId && (
      <p style={{marginBottom: 0}}><strong>{t('invoice.peppolBillitOrderId')}:</strong> {invoice.billit.orderId}</p>
    )}
    {invoice.billit?.aboutInvoiceNumber && (
      <p><strong>{t('invoice.peppolAboutInvoiceNumber')}:</strong> {invoice.billit.aboutInvoiceNumber}</p>
    )}
  </>
);


const BillitDeliveryDetails = ({delivery}: {delivery: InvoiceBillitDeliveryDetails}) => (
  <div style={{marginBottom: 8}}>
    <strong>{t('invoice.peppolDelivery')}:</strong>
    <ul style={{marginBottom: 0, paddingLeft: 20}}>
      <li><strong>{t('invoice.peppolDeliveryStatus')}:</strong> {delivery.status}</li>
      {!!delivery.date && (
        <li><strong>{t('invoice.peppolDeliveryDate')}:</strong> {moment(delivery.date).format('DD/MM/YYYY HH:mm')}</li>
      )}
      <li><strong>{t('invoice.peppolDeliveryDelivered')}:</strong> {delivery.delivered ? t('yes') : t('no')}</li>
      {delivery.info && <li><strong>{t('invoice.peppolDeliveryInfo')}:</strong> {delivery.info}</li>}
    </ul>
  </div>
);


const BillitMessages = ({messages}: {messages: InvoiceBillitMessage[]}) => (
  <div style={{marginBottom: 8}}>
    <strong>{t('invoice.peppolMessages')}:</strong>
    {messages.map((msg, idx) => (
      <div key={idx} style={{marginLeft: 10, marginTop: 4, padding: 8, backgroundColor: '#f5f5f5', borderRadius: 4}}>
        <div><strong>{msg.transportType}</strong> → {msg.destination}</div>
        <div style={{fontSize: '0.9em', color: '#666'}}>
          {moment(msg.creationDate).format('DD/MM/YYYY HH:mm')}
          {!!msg.description && <> - {msg.description}</>}
        </div>
        <div>
          {msg.success ? (
            <span style={{color: 'green'}}>✓ {t('invoice.peppolMessageSuccess')}</span>
          ) : (
            <span style={{color: 'orange'}}>⏳ {t('invoice.peppolMessagePending')} ({msg.trials} {t('invoice.peppolMessageTrials')})</span>
          )}
        </div>
      </div>
    ))}
  </div>
);


type SendToPeppolModalProps = {
  invoice: InvoiceModel;
  client: ClientModel | undefined;
  onClose: () => void;
  onConfirm: () => void;
}

export const SendToPeppolModal = ({invoice, client, onClose, onConfirm}: SendToPeppolModalProps) => {
  const hasSignedTimesheet = invoice.attachments.some(a => a.type === SignedTimesheetAttachmentType);
  const isPeppolEnabled = !!client?.peppolEnabled;

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
      confirmVariant="success"
      busyConfirm
      title={t('invoice.peppolSend')}
    >
      <BillitOrderInfo invoice={invoice} />
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


type PeppolStatusModalProps = {
  invoice: InvoiceModel;
  onClose: () => void;
  onRefresh: () => void;
}

export const PeppolStatusModal = ({invoice, onClose, onRefresh}: PeppolStatusModalProps) => (
  <Modal
    show
    onClose={onClose}
    onConfirm={onRefresh}
    confirmText={t('invoice.peppolRefreshStatus')}
    confirmVariant="light"
    confirmIcon="fas fa-sync"
    stayOpenOnConfirm
    title={t('invoice.peppolStatus')}
  >
    <BillitOrderInfo invoice={invoice} />
    {invoice.billit?.delivery && (
      <BillitDeliveryDetails delivery={invoice.billit.delivery} />
    )}
    {invoice.billit?.messages && invoice.billit.messages.length > 0 && (
      <BillitMessages messages={invoice.billit.messages} />
    )}
  </Modal>
);
