import { EditClientRateType, InvoiceDateStrategy, SelectItem } from "../../../models";

export type ConfigModel = {
  company: ConfigCompanyModel,
  defaultClient: string | null,
  defaultTax: number,
  attachmentTypes: string[],
  extraConfigFields: string[],
  defaultInvoiceLineType: EditClientRateType,
  defaultInvoiceDateStrategy: InvoiceDateStrategy,
  defaultExtraClientFields: string[],
  defaultExtraInvoiceFields: string[],
  defaultExtraClientInvoiceFields: SelectItem[],

  showOrderNr: boolean,
  groupInvoiceListByMonth: boolean,
}

export type ConfigCompanyModel = {
  template: string,
  name: string,
  address: string,
  city: string,
  btw: string,
  bank: string,
  iban: string,
  bic: string,
  telephone: string,
  email: string,
  website: string,
}
