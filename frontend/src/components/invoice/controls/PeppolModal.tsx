import moment from 'moment';
import {t} from '../../utils';
import {Modal} from '../../controls/Modal';
import {Icon} from '../../controls/Icon';
import {SignedTimesheetAttachmentType} from '../../../models';
import {ClientModel} from '../../client/models/ClientModels';
import InvoiceModel from '../models/InvoiceModel';


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
