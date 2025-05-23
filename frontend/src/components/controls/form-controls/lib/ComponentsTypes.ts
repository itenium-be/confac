type CustomComponents = 'InvoiceLineTypeSelect' | 'ProjectLineTypeSelect' | 'InvoiceDateStrategySelect' | 'PropertiesSelect'
  | 'ExtraFields' | 'StringsSelect' | 'ClientSelect' | 'ClientTypeSelect' | 'ConsultantTypeSelect' | 'EditProjectClient'
  | 'EditProjectEndCustomer' | 'ProjectSelect' | 'RolesSelect' | 'ClaimsSelect'
  | 'ConsultantSelectWithCreateModal' | 'InvoiceReplacementsInput' | 'InvoiceReplacementsTextEditor' | 'EditProjectClientAsEndCustomer'
  | 'PartnerSelectWithCreateModal' | 'EndCustomerSelectWithCreateModal' | 'LanguageSelect' | 'EditInvoiceLines'
  | 'ProjectMonthInboundStatusSelect' | 'ProjectMonthStatusSelect' | 'AttachmentsTypeSelect' | 'EditProjectPartner'
  | 'ClientSelectWithCreateModal' | 'ContractStatusWithNotes' | 'ProjectClientContractStatus' | 'CountrySelect' | 'ProjectProformaSelect';

export type StandardComponents = 'number' | 'text' | 'textarea' | 'basic-math' | 'switch' | 'month'
  | CustomComponents | 'float' | 'money' | 'email' | 'phone' | 'website' | 'btw' | 'iban' | 'TextEditor' | 'bool' | 'date'
  | 'nullableFloat';
