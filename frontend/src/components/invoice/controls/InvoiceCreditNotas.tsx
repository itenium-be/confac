import InvoiceModel from "../models/InvoiceModel"
import { t } from "../../utils";
import { createInvoiceList, InvoiceFeatureBuilderConfig } from "../models/getInvoiceFeature";
import { List } from "../../controls/table/List";
import { Claim } from "../../users/models/UserModel";
import { ListSelectionItem } from "../../controls/table/ListSelect";
import { InvoiceCreditNotasModal } from "./InvoiceCreditNotasModal";


export type InvoiceCreditNotasProps = {
  config: InvoiceFeatureBuilderConfig,
  model: InvoiceModel,
  onChange: (invoice: InvoiceModel) => void,
}

export const InvoiceCreditNotas = ({config, model, onChange}: InvoiceCreditNotasProps) => {
  const feature = createInvoiceList({
    ...config,
    data: config.data.filter(i => model.creditNotas.includes(i.number)),
    disableFilters: true,
    includedFields: [
      'number',
      'client',
      'date-full',
      'period',
      'consultant',
      'total-amount',
    ]
  });


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
      <h2>{t('invoice.creditNotas.title')}</h2>
      <List feature={feature} />

      <InvoiceCreditNotasModal
        model={model}
        onConfirm={saveCreditNotas}
        config={config}
        claim={Claim.ManageInvoices}
      />
    </>
  );

}
