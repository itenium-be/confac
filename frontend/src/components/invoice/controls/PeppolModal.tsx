import moment from 'moment';
import {t} from '../../utils';
import {Modal} from '../../controls/Modal';
import {Icon} from '../../controls/Icon';
import {SignedTimesheetAttachmentType} from '../../../models';
import {ClientModel} from '../../client/models/ClientModels';
import InvoiceModel, {InvoiceBillitDeliveryDetails, InvoiceBillitMessage} from '../models/InvoiceModel';


const BillitDeliveryDetails = ({delivery}: {delivery: InvoiceBillitDeliveryDetails}) => (
  <div style={{marginBottom: 8}}>
    <strong>{t('invoice.peppolDelivery')}:</strong>
    <ul style={{marginBottom: 0, paddingLeft: 20}}>
      <li><strong>{t('invoice.peppolDeliveryStatus')}:</strong> {delivery.status}</li>
      <li><strong>{t('invoice.peppolDeliveryDate')}:</strong> {moment(delivery.date).format('DD/MM/YYYY HH:mm')}</li>
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
          {!!msg.description && <>- {msg.description}</>}
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


type PeppolModalProps = {
  invoice: InvoiceModel;
  client: ClientModel | undefined;
  onClose: () => void;
  onConfirm: () => void;
}

export const PeppolModal = ({invoice, client, onClose, onConfirm}: PeppolModalProps) => {
  const hasSignedTimesheet = invoice.attachments.some(a => a.type === SignedTimesheetAttachmentType);
  const isPeppolEnabled = !!client?.peppolEnabled;
  const alreadySent = !!invoice.lastEmail;

  let transportType = isPeppolEnabled ? 'Peppol' : 'Email';
  if (client?.peppolEnabled === undefined) {
    transportType = '???';
  }

  const isResend = invoice.status === 'ToPay' || invoice.status === 'Paid';

  return (
    <Modal
      show
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={t('invoice.peppolSend')}
      confirmVariant={isResend ? 'danger' : 'success'}
      title={t('invoice.peppolSend')}
    >
      {alreadySent && (
        <p style={{marginBottom: 0}}><strong>{t('invoice.peppolSentOn')}:</strong> {moment(invoice.lastEmail).format('DD/MM/YYYY HH:mm')}</p>
      )}
      {invoice.billit?.orderId && (
        <p><strong>{t('invoice.peppolBillitOrderId')}:</strong> {invoice.billit?.orderId}</p>
      )}
      {invoice.billit?.delivery && (
        <BillitDeliveryDetails delivery={invoice.billit.delivery} />
      )}
      {invoice.billit?.messages && invoice.billit.messages.length > 0 && (
        <BillitMessages messages={invoice.billit.messages} />
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
