import { EditClientRateType, InvoiceDateStrategy, IAttachment, Attachment } from "../../models";

export type EditClientRateModel = {
  type: EditClientRateType,
  hoursInDay: number,
  value: number,
  description: string,
}

export type EditClientModel = IAttachment & {
  _id: string,
  slug: string,
  active: boolean,
  name: string,
  address: string,
  city: string,
  telephone: string,
  btw: string,
  invoiceFileName: string,
  rate: EditClientRateModel,
  attachments: Array<Attachment>,
  extraFields: Array<string>,
  defaultExtraInvoiceFields: Array<string>,
  notes: string,
  defaultInvoiceDateStrategy: InvoiceDateStrategy,
}
