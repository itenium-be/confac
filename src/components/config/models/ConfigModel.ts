import { EditClientRateType, InvoiceDateStrategy, SelectItem } from "../../../models";

export type ConfigModel = {
  company: ConfigCompanyModel,
  defaultClient: string | null,
  defaultTax: number,
  attachmentTypes: string[],
  defaultInvoiceLineType: EditClientRateType,
  defaultInvoiceDateStrategy: InvoiceDateStrategy,
  defaultExtraClientFields: SelectItem[],
  defaultExtraInvoiceFields: SelectItem[],
  defaultExtraClientInvoiceFields: SelectItem[],
  invoicePayDays: number,
  /**
   * The default invoice file name when creating a new client
   */
  invoiceFileName: string,
  template: string,
  templateQuotation: string,

  showOrderNr: boolean,
  groupInvoiceListByMonth: boolean,
}

export type ConfigCompanyModel = {
  name: string,
  address: string,
  city: string,
  btw: string,
  rpr: string,
  bank: string,
  iban: string,
  bic: string,
  telephone: string,
  email: string,
  website: string,
}
