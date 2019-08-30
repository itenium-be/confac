import { CSSProperties } from 'react';
import { InputIcons } from "./components/controls/form-controls/lib/IconFactory";
import { StandardComponents } from "./components/controls/form-controls/lib/EditComponentFactory";

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
  /**
   * 'pdf' is the invoice pdf (for invoice/quotation)
   */
  type: 'pdf' | string,
  fileName: string,
  fileType: string,
  lastModifiedDate: string,
}

/**
 * EditInvoiceModel | EditClientModel
 * TODO: Add the modelType here
 */
export interface IAttachment {
  _id: string,
  attachments: Attachment[],
  // getType: () => 'invoice' | 'quotation' | 'client',
}

export type AppState = {
  isLoaded: boolean,
  isBusy: boolean,
  busyCount: number,
  invoiceFilters: InvoiceFilters,
}

export type NewRowFormConfig = {forceRow: boolean}

export type AnyFormConfig = string | NewRowFormConfig | FormConfig;

export type FormConfig = {
  /**
   * The property name of the model
   */
  key?: string,
  /**
   * The React Component to use
   * Defaults to StringInput
   * TODO: Need an interface for this component...
   */
  component?: React.ReactNode | StandardComponents,
  /**
   * True: Do not show when creating the record
   * (ex: "slug" which is calculated when saving)
   */
  updateOnly?: boolean,
  /**
   * Set specific Grid col amount
   */
  cols?: number,
  /**
   * Col offset
   */
  offset?: number,
  prefix?: InputIcons | React.ReactNode | string,
  suffix?: InputIcons | React.ReactNode | string,
  style?: CSSProperties,

}

export type FullFormConfig = AnyFormConfig[] & {
  addMissingProps?: boolean,
}


export type InvoiceFiltersSearch = {
  value: string | number,
  label: string | number,
  type: 'invoice-nr' | 'year' | 'client' | 'invoice_line' | 'manual_input',
}

/**
 * Filters used on InvoiceList and ClientList
 * Used for: state.app.invoiceFilters
 */
export type InvoiceFilters = {
  search: InvoiceFiltersSearch[],
  unverifiedOnly: boolean,
  groupedByMonth: boolean,
  clientListYears: number[],
  freeClient: string,
  freeInvoice: string,
}

/**
 * Model used for the Select Components
 */
export type SelectItem = {
  label: string | number,
  value: string | number,
  className?: string,
}

export type BootstrapVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | 'link'
  | 'outline-primary' | 'outline-secondary' | 'outline-success' | 'outline-danger' | 'outline-warning'
  | 'outline-info' | 'outline-dark' | 'outline-light';
