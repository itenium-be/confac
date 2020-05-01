import React from 'react';
import {useDispatch} from 'react-redux';
import InvoiceModel from '../models/InvoiceModel';
import {EditIcon} from '../../controls/Icon';
import {InvoiceVerifyIconToggle} from '../invoice-list/InvoiceVerifyIconToggle';
import {InvoiceDownloadIcon, InvoicePreviewIcon} from '../../controls/attachments/AttachmentDownloadIcon';
import {t} from '../../utils';
import {deleteInvoice} from '../../../actions';
import {ConfirmedDeleteIcon} from '../../controls/icons/DeleteIcon';


type InvoiceListRowActionsProps = {
  invoice: InvoiceModel;
  toggleValid?: (valid: boolean) => void;
}

export const InvoiceListRowActions = ({invoice, toggleValid}: InvoiceListRowActionsProps) => {
  const dispatch = useDispatch();
  const invoiceType = invoice.isQuotation ? 'quotation' : 'invoice';
  return (
    <>
      <EditIcon
        onClick={`/${invoiceType}s/${invoice.number}`}
        style={{marginRight: invoice.isQuotation ? undefined : -15}}
      />
      <InvoiceVerifyIconToggle invoice={invoice} toggleValid={toggleValid} />
      <InvoiceDownloadIcon invoice={invoice} />
      <InvoicePreviewIcon invoice={invoice} />
      <ConfirmedDeleteIcon
        title={t(`${invoiceType}.deleteTitle`)}
        onClick={() => dispatch(deleteInvoice(invoice))}
      >
        {t(`${invoiceType}.deletePopup`, {number: invoice.number, client: invoice.client.name})}
      </ConfirmedDeleteIcon>
    </>
  );
};
