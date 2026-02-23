import InvoiceModel from '../models/InvoiceModel';
import {EditIcon} from '../../controls/Icon';
import {InvoiceVerifyIconToggle} from '../invoice-list/InvoiceVerifyIconToggle';
import {InvoiceDownloadIcon, InvoicePreviewIcon} from '../../controls/attachments/AttachmentDownloadIcon';
import {t} from '../../utils';
import {deleteInvoice, updateInvoiceRequest} from '../../../actions';
import {ConfirmedDeleteIcon} from '../../controls/icons/DeleteIcon';
import {Claim} from '../../users/models/UserModel';
import {NotesWithCommentsModalButton} from '../../controls/form-controls/button/NotesWithCommentsModalButton';
import {useAppDispatch} from '../../hooks/useAppDispatch';


export type InvoiceListRowAction = 'comment' | 'edit' | 'validate' | 'download' | 'preview' | 'delete';


type InvoiceListRowActionsProps = {
  invoice: InvoiceModel;
  toggleBusy?: boolean;
  /** Hides some buttons when true */
  small?: boolean;
  buttons?: InvoiceListRowAction[];
  hideEdit?: boolean;
}

export const InvoiceListRowActions = ({invoice, small = false, buttons, hideEdit, toggleBusy}: InvoiceListRowActionsProps) => {
  const dispatch = useAppDispatch();
  const invoiceType = invoice.isQuotation ? 'quotation' : 'invoice';

  return (
    <>
      {!hideEdit && (buttons?.includes('comment') ?? true) && (
        <NotesWithCommentsModalButton
          claim={Claim.ManageInvoices}
          includeBorder={false}
          value={{note: invoice.note, comments: invoice.comments || []}}
          onChange={val => {
            const updatedInvoice = new InvoiceModel(invoice.config, {
              ...invoice,
              note: val.note || '',
              comments: val.comments
            });
            dispatch(updateInvoiceRequest(updatedInvoice, undefined, false));
          }}
          title={t('client.comments')}
          style={{marginRight: invoice.isQuotation ? undefined : -5}}
          showNote
        />
      )}
      {!hideEdit && (buttons?.includes('edit') ?? true) && !small && (
        <EditIcon
          onClick={`/${invoiceType}s/${invoice.number}`}
          style={{marginRight: invoice.isQuotation ? undefined : -15}}
        />
      )}
      {!hideEdit && (buttons?.includes('validate') ?? true) && (
        <InvoiceVerifyIconToggle claim={Claim.ValidateInvoices} invoice={invoice} toggleBusy={toggleBusy} />
      )}
      {(buttons?.includes('download') ?? true) && !small && (
        <InvoiceDownloadIcon invoice={invoice} fileType="pdf" />
      )}
      {(buttons?.includes('preview') ?? true) && (
        <InvoicePreviewIcon invoice={invoice} />
      )}

      {(buttons?.includes('delete') ?? true) && !small && (
        <ConfirmedDeleteIcon
          claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.ManageInvoices}
          title={t(`${invoiceType}.deleteTitle`)}
          onClick={() => dispatch(deleteInvoice(invoice))}
        >
          {t(`${invoiceType}.deletePopup`, {number: invoice.number, client: invoice.client.name})}
        </ConfirmedDeleteIcon>
      )}
    </>
  );
};
