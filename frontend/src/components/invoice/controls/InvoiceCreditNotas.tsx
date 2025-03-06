import InvoiceModel from "../models/InvoiceModel"
import { t } from "../../utils";
import { createInvoiceList, InvoiceFeatureBuilderConfig } from "../models/getInvoiceFeature";
import { List } from "../../controls/table/List";
import { Claim } from "../../users/models/UserModel";
import { ListSelectionItem } from "../../controls/table/ListSelect";
import { InvoiceCreditNotasModal } from "./InvoiceCreditNotasModal";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ConfacState } from "../../../reducers/app-state";
import { useDispatch } from "react-redux";
import { updateAppFilters, updateInvoiceRequest } from "../../../actions";
import { Features } from "../../controls/feature/feature-models";


export type InvoiceCreditNotasProps = {
  model: InvoiceModel,
  onChange: (invoice: InvoiceModel) => void,
}

export const InvoiceCreditNotas = ({ model, onChange}: InvoiceCreditNotasProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const invoiceFilters = useSelector((state: ConfacState) => state.app.filters.invoices)
  const invoicePayDays = useSelector((state: ConfacState) => state.config.invoicePayDays);
  const invoices = useSelector((state: ConfacState) => state.invoices);

  const featureConfig: InvoiceFeatureBuilderConfig = {
    isQuotation: model.isQuotation,
    invoicePayDays,
    isGroupedOnMonth: false,
    data: invoices,
    save: m => dispatch(updateInvoiceRequest(m, undefined, false, navigate) as any),
    filters: invoiceFilters,
    setFilters: f => dispatch(updateAppFilters(Features.invoices, f)),

  }

  const creditNotas = featureConfig.data.filter(i => model.creditNotas.includes(i.number) && !i.isQuotation)
  if(creditNotas.length === 0) {
    return null
  }

  const feature = createInvoiceList({
    ...featureConfig,
    data: [...creditNotas, model],
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
    currentInvoice: model
  });

  feature.list.sorter = (a, b) => a.number - b.number;

  const saveCreditNotas = (selectedInvoices: ListSelectionItem<InvoiceModel>) => {
    if(Array.isArray(selectedInvoices)) {
      model.setCreditNotas(selectedInvoices)
    } else {
      model.setCreditNotas([selectedInvoices])
    }
    onChange(model)
  };

  return (
    <>
      <div style={ {marginBottom: '1rem'}} >
        <h2>{t('invoice.creditNotas.title')}</h2>
        <List feature={feature} />

        <InvoiceCreditNotasModal
          model={model}
          onConfirm={saveCreditNotas}
          config={featureConfig}
          claim={Claim.ManageInvoices}
        />
      </div>
    </>
  );

}
