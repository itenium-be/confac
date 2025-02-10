type CustomComponents = 'InvoiceLineTypeSelect' | 'ProjectLineTypeSelect' | 'InvoiceDateStrategySelect' | 'PropertiesSelect'
  | 'ExtraFields' | 'StringsSelect' | 'ClientSelect' | 'ClientTypeSelect' | 'ConsultantTypeSelect' | 'EditProjectClient' | 'EditProjectEndCustomer' | 'ProjectSelect'
  | 'ConsultantSelectWithCreateModal' | 'InvoiceReplacementsInput' | 'InvoiceReplacementsTextEditor'
  | 'PartnerSelectWithCreateModal' | 'EndCustomerSelectWithCreateModal' | 'LanguageSelect' | 'EditInvoiceLines' | 'RolesSelect' | 'ClaimsSelect'
  | 'ProjectMonthInboundStatusSelect' | 'ProjectMonthStatusSelect' | 'AttachmentsTypeSelect' | 'EditProjectPartner'
  | 'ClientSelectWithCreateModal' | 'ContractStatusWithNotes' | 'ProjectClientContractStatus' | 'CountrySelect';

export type StandardComponents = 'number' | 'text' | 'textarea' | 'basic-math' | 'switch' | 'month'
  | CustomComponents | 'float' | 'money' | 'email' | 'phone' | 'website' | 'btw' | 'iban' | 'TextEditor' | 'bool' | 'date';
