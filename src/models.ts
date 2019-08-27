export type InvoiceDateStrategy = 'prev-month-last-day' | 'today';

/**
 * Array defined as invoiceLineTypes
 */
export type EditClientRateType = 'hourly' | 'daily' | 'km' | 'items' | 'section' | 'other';

export type ClientRate = {
  type: EditClientRateType,
  hoursInDay: number,
  /**
   * TODO: rename to price?
   */
  value: number,
  description: string,
}


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
}

export type FormConfig = string | {
  key: string,
  component: React.ReactNode
}

export type InvoiceFilters = {
  search: Array<{value: string, label: string, type: string}>,
  unverifiedOnly: boolean,
  groupedByMonth: boolean,
  clientListYears: number[],
}

export type BootstrapVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | 'link'
  | 'outline-primary' | 'outline-secondary' | 'outline-success' | 'outline-danger' | 'outline-warning'
  | 'outline-info' | 'outline-dark' | 'outline-light';
