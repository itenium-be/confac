import React from 'react';
import {useDispatch} from 'react-redux';
import InvoiceModel from '../models/InvoiceModel';
import {EditIcon} from '../../controls/Icon';
import {InvoiceVerifyIconToggle} from '../invoice-list/InvoiceVerifyIconToggle';
import {InvoiceDownloadIcon, InvoicePreviewIcon} from '../../controls/attachments/AttachmentDownloadIcon';
import {t} from '../../utils';
import {deleteInvoice} from '../../../actions';
import {ConfirmedDeleteIcon} from '../../controls/icons/DeleteIcon';
import {Claim} from '../../users/models/UserModel';


type InvoiceListRowActionsProps = {
  invoice: InvoiceModel;
  /** When from the ProjectMonth listing, also update the state of the form there */
  toggleValid?: (valid: boolean) => void;
  /** Hides some buttons when true */
  small?: boolean;
}

export const InvoiceListRowActions = ({invoice, toggleValid, small = false}: InvoiceListRowActionsProps) => {
  const dispatch = useDispatch();
  const invoiceType = invoice.isQuotation ? 'quotation' : 'invoice';
  return (
    <>
      {!small && (
        <EditIcon
          onClick={`/${invoiceType}s/${invoice.number}`}
          style={{marginRight: invoice.isQuotation ? undefined : -15}}
        />
      )}
      <InvoiceVerifyIconToggle claim={Claim.ValidateInvoices} invoice={invoice} toggleValid={toggleValid} />
      {!small && <InvoiceDownloadIcon invoice={invoice} fileType='pdf'/>}
      <InvoicePreviewIcon invoice={invoice} />
      {!small && (
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
