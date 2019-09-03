import { EditClientRateType, InvoiceDateStrategy, IAttachment, Attachment, SelectItem } from "../../../models";

export type ClientRateModel = {
  type: EditClientRateType,
  hoursInDay: number,
  value: number,
  description: string,
}

export type ClientModel = IAttachment & {
  _id: string,
  slug: string,
  active: boolean,
  name: string,
  address: string,
  city: string,
  telephone: string,
  btw: string,
  invoiceFileName: string,
  rate: ClientRateModel,
  attachments: Array<Attachment>,
  extraFields: Array<SelectItem>,
  defaultExtraInvoiceFields: Array<SelectItem>,
  notes: string,
  defaultInvoiceDateStrategy: InvoiceDateStrategy,
  createdOn?: string,
}
