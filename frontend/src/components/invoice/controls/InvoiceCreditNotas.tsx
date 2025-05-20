import InvoiceModel from '../models/InvoiceModel';
import { t } from '../../utils';
import { createInvoiceList } from '../models/getInvoiceFeature';
import { List } from '../../controls/table/List';
import { Claim } from '../../users/models/UserModel';
import { ListSelectionItem } from '../../controls/table/ListSelect';
import { InvoiceCreditNotasModal } from './InvoiceCreditNotasModal';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ConfacState } from '../../../reducers/app-state';
import { useDispatch } from 'react-redux';
import { updateInvoiceRequest } from '../../../actions';
import { ClaimGuard } from '../../enhancers/EnhanceWithClaim';


export type InvoiceCreditNotasProps = {
  model: InvoiceModel;
  onChange: (invoice: InvoiceModel) => void;
}

export const InvoiceCreditNotas = ({model, onChange}: InvoiceCreditNotasProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const invoicePayDays = useSelector((state: ConfacState) => state.config.invoicePayDays);
  const otherCreditNotas = useSelector((state: ConfacState) => state.invoices
    .filter(i => model.creditNotas.includes(i._id))
  );

  if (otherCreditNotas.length === 0) {
    return null;
  }

  const creditNotas = [...otherCreditNotas, model];
  const feature = createInvoiceList({
    isQuotation: model.isQuotation,
    invoicePayDays,
    isGroupedOnMonth: false,
    data: creditNotas,
    save: m => dispatch(updateInvoiceRequest(m, undefined, false, navigate) as any),
    filters: {},
    setFilters: f => {},
    disableFilters: true,
    invoicesTotalOnly: true,
    includedFields: [
      'number',
      'client',
      'date-full',
      'period',
      'consultant',
      'total-amount',
      'buttons'
    ],
    buttons: ['comment', 'edit', 'validate', 'preview'],
    currentInvoice: model,
    defaultSorter: (a, b) => b.number - a.number
  });

  const saveCreditNotas = (selectedInvoiceNrs: ListSelectionItem<string>) => {
    if (Array.isArray(selectedInvoiceNrs)) {
      model.setCreditNotas(selectedInvoiceNrs);
    } else {
      model.setCreditNotas([selectedInvoiceNrs]);
    }
    onChange(model);
  };

  return (
    <div style={{marginBottom: '1rem'}}>
      <h2>{t('invoice.creditNotas.title')}</h2>
      <List feature={feature} />

      <ClaimGuard claim={Claim.ManageInvoices}>
        <InvoiceCreditNotasModal
          model={model}
          onConfirm={saveCreditNotas}
        />
      </ClaimGuard>
    </div>
  );
};
