import React from 'react';
import {useNavigate} from 'react-router-dom';
import {t} from '../../utils';
import InvoiceModel from '../models/InvoiceModel';
import {BusyButton} from '../../controls/form-controls/BusyButton';
import {Claim} from '../../users/models/UserModel';

type EditInvoiceSaveButtonsComponentProps = {
  invoice: InvoiceModel,
  onClick: (type: 'create' | 'update' | 'preview', navigate: any) => void,
}

export const EditInvoiceSaveButtons = ({invoice, onClick}: EditInvoiceSaveButtonsComponentProps) => {
  const navigate = useNavigate();
  const isNewInvoice = invoice.isNew;
  const tp = (transKey: string): string => t(invoice.getType() + transKey);
  return (
    <>
      <BusyButton
        claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.ManageInvoices}
        variant="light"
        onClick={() => onClick('preview', navigate)}
        icon="far fa-eye"
        className="tst-btn-view"
      >
        {t('invoice.preview')}
      </BusyButton>
      <BusyButton
      className="tst-btn-create"
        claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.ManageInvoices}
        onClick={() => onClick(isNewInvoice ? 'create' : 'update', navigate)}
      >
        {isNewInvoice ? tp('.create') : t('save')}
      </BusyButton>
    </>
  );
};
