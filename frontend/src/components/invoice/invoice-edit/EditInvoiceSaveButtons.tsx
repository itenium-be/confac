import {useNavigate} from 'react-router-dom';
import {t} from '../../utils';
import InvoiceModel from '../models/InvoiceModel';
import {BusyButton} from '../../controls/form-controls/BusyButton';
import {Claim} from '../../users/models/UserModel';

type EditInvoiceSaveButtonsComponentProps = {
  invoice: InvoiceModel,
  onClick: (type: 'create' | 'update' | 'preview' | 'clone', navigate: any) => void,
}

export const EditInvoiceSaveButtons = ({invoice, onClick}: EditInvoiceSaveButtonsComponentProps) => {
  const navigate = useNavigate();
  const isNewInvoice = invoice.isNew;
  const tp = (transKey: string): string => t(invoice.getType() + transKey);
  return (
    <>
      {!isNewInvoice && !invoice.isQuotation &&
        <BusyButton
          claim={Claim.ManageInvoices}
          variant='light'
          icon="far fa-thin fa-copy"
          onClick={() => onClick('clone', navigate)}
          className="tst-clone-invoice"
        >
          {t('invoice.createCreditNota')}
        </BusyButton>
      }
      <BusyButton
        claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.ManageInvoices}
        variant="light"
        onClick={() => onClick('preview', navigate)}
        icon="far fa-eye"
        className="tst-preview-invoice"
      >
        {t('invoice.preview')}
      </BusyButton>
      <BusyButton
        className="tst-save-invoice"
        claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.ManageInvoices}
        onClick={() => onClick(isNewInvoice ? 'create' : 'update', navigate)}
      >
        {isNewInvoice ? tp('.create') : t('save')}
      </BusyButton>
    </>
  );
};
