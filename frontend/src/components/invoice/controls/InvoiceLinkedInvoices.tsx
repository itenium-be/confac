
import InvoiceModel from "../models/InvoiceModel"
import { t } from "../../utils";
import { createInvoiceList, InvoiceFeatureBuilderConfig } from "../models/getInvoiceFeature";
import { List } from "../../controls/table/List";
import { Claim } from "../../users/models/UserModel";
import { InvoiceLinkedInvoicesModal } from "./InvoiceLinkedInvoicesModal";
import { ListSelectionItem } from "../../controls/table/ListSelect";


export type InvoiceLinkedInvoicesProps = {
  config: InvoiceFeatureBuilderConfig,
  model: InvoiceModel,
  onChange: (invoice: InvoiceModel) => void,
}

export const InvoiceLinkedInvoices = ({config, model, onChange}: InvoiceLinkedInvoicesProps) => {
  const feature = createInvoiceList({
    ...config,
    data: config.data.filter(i => model.linkedInvoiceNumbers.includes(i.number)),
    disableFilters: true,
    includedFields: [
      'number',
      'client',
      'date-full',
      'period',
      'consultant',
    ]
  });


  const saveLinkedInvoices = (selectedInvoices: ListSelectionItem<InvoiceModel>) => {
    if(Array.isArray(selectedInvoices)) {
      model.setLinkedInvoices(selectedInvoices)
    } else {
      model.setLinkedInvoices([selectedInvoices])
    }
    onChange(model)
  };

  return (
    <>
      <h2>{t('invoice.linkedInvoices.title')}</h2>
      <List feature={feature} />

      <InvoiceLinkedInvoicesModal
        model={model}
        onConfirm={saveLinkedInvoices}
        config={config}
        claim={Claim.ManageInvoices}
      />
    </>
  );

}
