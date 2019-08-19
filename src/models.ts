export type InvoiceDateStrategy = 'prev-month-last-day' | 'today';

export type EditClientRateType = 'hourly' | 'daily' | 'km' | 'items' | 'section' | 'other';

export type Attachment = {
  type: string,
  fileName: string,
  fileType: string,
  lastModifiedDate: string,
}

export type AppState = {
  isLoaded: boolean,
  isBusy: boolean,
  busyCount: number,
  invoiceFilters: InvoiceFilters,
  pdf: string | null,
}

export type InvoiceFilters = {
  search: Array<{value: string, label: string, type: string}>,
  unverifiedOnly: boolean,
  groupedByMonth: boolean,
  clientListYears: number[],
}
