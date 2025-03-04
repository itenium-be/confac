import {useDispatch} from 'react-redux';
import InvoiceModel from '../models/InvoiceModel';
import {EditIcon} from '../../controls/Icon';
import {InvoiceVerifyIconToggle} from '../invoice-list/InvoiceVerifyIconToggle';
import {InvoiceDownloadIcon, InvoicePreviewIcon} from '../../controls/attachments/AttachmentDownloadIcon';
import {t} from '../../utils';
import {deleteInvoice, updateInvoiceRequest} from '../../../actions';
import {ConfirmedDeleteIcon} from '../../controls/icons/DeleteIcon';
import {Claim} from '../../users/models/UserModel';
import { NotesWithCommentsModalButton } from '../../controls/form-controls/button/NotesWithCommentsModalButton';


export type InvoiceListRowAction = 'comment' | 'edit' | 'validate' | 'download' | 'preview' | 'delete'


type InvoiceListRowActionsProps = {
  invoice: InvoiceModel;
  /** When from the ProjectMonth listing, also update the state of the form there */
  toggleValid?: (valid: boolean) => void;
  /** Hides some buttons when true */
  small?: boolean;
  buttons?: InvoiceListRowAction[]
}

export const InvoiceListRowActions = ({invoice, toggleValid, small = false, buttons}: InvoiceListRowActionsProps) => {
  const dispatch = useDispatch();
  const invoiceType = invoice.isQuotation ? 'quotation' : 'invoice';



  return (
    <>
      {(buttons?.includes('comment') ?? true) && (
        <NotesWithCommentsModalButton
          claim={Claim.ManageInvoices}
          value={{note: invoice.note, comments: invoice.comments || [] }}
          onChange={val => {
            const updatedInvoice = new InvoiceModel(invoice.config, {
                ...invoice,
                note: val.note || '',
                comments: val.comments
              })
            dispatch(updateInvoiceRequest(updatedInvoice, undefined, false) as any)
          }}
          title={t('client.comments')}
        />
      )}
      {(buttons?.includes('edit') ?? true) && !small && (
        <EditIcon
          onClick={`/${invoiceType}s/${invoice.number}`}
          style={{marginRight: invoice.isQuotation ? undefined : -15}}
        />
      )}
      {(buttons?.includes('validate') ?? true) &&
        <InvoiceVerifyIconToggle claim={Claim.ValidateInvoices} invoice={invoice} toggleValid={toggleValid} />
      }
      {(buttons?.includes('download') ?? true) && !small &&
        <InvoiceDownloadIcon invoice={invoice} fileType='pdf'/>
      }
      {(buttons?.includes('preview') ?? true) &&
        <InvoicePreviewIcon invoice={invoice} />
      }

      {(buttons?.includes('delete') ?? true) && !small && (
        <ConfirmedDeleteIcon
          claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.ManageInvoices}
          title={t(`${invoiceType}.deleteTitle`)}
          onClick={() => dispatch(deleteInvoice(invoice) as any)}
        >
          {t(`${invoiceType}.deletePopup`, {number: invoice.number, client: invoice.client.name})}
        </ConfirmedDeleteIcon>
      )}
    </>
  );
};
