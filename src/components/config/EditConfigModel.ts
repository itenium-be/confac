import { EditClientRateType, InvoiceDateStrategy } from "../../models";

export type EditConfigModel = {
  company: EditConfigCompanyModel,
  defaultClient: string,
  defaultTax: number,
  attachmentTypes: string[],
  extraConfigFields: string[],
  defaultInvoiceLineType: EditClientRateType,
  defaultInvoiceDateStrategy: InvoiceDateStrategy,
  defaultExtraClientFields: string[],
  defaultExtraInvoiceFields: string[],
  defaultExtraClientInvoiceFields: string[],

  showOrderNr: boolean,
  groupInvoiceListByMonth: boolean,
}

export type EditConfigCompanyModel = {
  template: string,
  name: string,
  address: string,
  city: string,
  btw: string,
  bank: string,
  bic: string,
  telephone: string,
  email: string,
  website: string,
}
