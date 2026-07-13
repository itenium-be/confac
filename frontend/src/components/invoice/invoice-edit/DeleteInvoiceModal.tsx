import {t} from '../../utils';
import {Popup, PopupButton} from '../../controls/Popup';
import InvoiceModel from '../models/InvoiceModel';


export type DeleteInvoiceModalProps = {
  invoice: InvoiceModel;
  canArchive: boolean;
  isNotLastInvoice: boolean;
  onClose: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onBackToDraft: () => void;
}


export const DeleteInvoiceModal = ({invoice, canArchive, isNotLastInvoice, onClose, onDelete, onArchive, onBackToDraft}: DeleteInvoiceModalProps) => {
  const hasBillitOrder = !!invoice.billit?.orderId;
  const hasAlternatives = canArchive || hasBillitOrder;

  const buttons: PopupButton[] = [
    {text: t('cancel'), onClick: onClose, variant: 'light'},
    ...(canArchive ? [{
      text: t('invoice.archive'),
      variant: 'outline-danger' as const,
      onClick: onArchive,
    }] : []),
    ...(hasBillitOrder ? [{
      text: t('invoice.backToDraft'),
      variant: 'outline-danger' as const,
      onClick: onBackToDraft,
    }] : []),
    {
      text: t('delete'),
      variant: 'danger',
      onClick: onDelete,
    },
  ];

  return (
    <Popup title={t('invoice.deleteTitle')} buttons={buttons} onHide={onClose}>
      {hasAlternatives && <h6 style={{fontWeight: 'bold'}}>{t('delete')}</h6>}
      <p>{t('invoice.deletePopup', {number: invoice.number, client: invoice.client.name})}</p>
      {isNotLastInvoice && <p>{t('invoice.deleteGapWarning')}</p>}
      {hasBillitOrder && <p>{t('invoice.deleteToSendWarning')}</p>}
      {hasBillitOrder && (
        <>
          <hr />
          <h6 style={{fontWeight: 'bold'}}>{t('invoice.backToDraft')}</h6>
          <p>{t('invoice.backToDraftPopup')}</p>
        </>
      )}
      {canArchive && (
        <>
          <hr />
          <h6 style={{fontWeight: 'bold'}}>{t('invoice.archive')}</h6>
          <p>{t('invoice.archivePopup')}</p>
        </>
      )}
    </Popup>
  );
};
