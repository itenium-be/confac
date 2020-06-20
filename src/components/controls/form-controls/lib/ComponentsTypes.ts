type CustomComponents = 'InvoiceLineTypeSelect' | 'ProjectLineTypeSelect' | 'InvoiceDateStrategySelect' | 'PropertiesSelect'
  | 'ExtraFields' | 'StringsSelect' | 'ClientSelect' | 'ConsultantTypeSelect' | 'EditProjectClient'
  | 'ConsultantSelectWithCreateModal' | 'InvoiceReplacementsInput' | 'InvoiceReplacementsTextEditor'
  | 'PartnerSelectWithCreateModal' | 'LanguageSelect' | 'EditInvoiceLines' | 'RolesSelect' | 'ClaimsSelect';

export type StandardComponents = 'number' | 'text' | 'textarea' | 'basic-math' | 'switch'
  | CustomComponents | 'float' | 'money' | 'email' | 'phone' | 'website' | 'btw' | 'iban' | 'textEditor' | 'bool' | 'date';
