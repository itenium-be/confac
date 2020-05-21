import {CSSProperties} from 'react';
import {InputIcons} from './components/controls/form-controls/lib/IconFactory';
import {StandardComponents} from './components/controls/form-controls/lib/ComponentsTypes';
import {ConsultantListFilters, ClientListFilters, InvoiceListFilters,
  ProjectListFilters, ProjectMonthListFilters, UsersListFilters} from './components/controls/table/table-models';

export type InvoiceDateStrategy = 'prev-month-last-day' | 'today';


/** Array defined as projectLineTypes */
export type EditProjectRateType = 'hourly' | 'daily';

/** Array defined as invoiceLineTypes */
export type EditClientRateType = EditProjectRateType | 'km' | 'items' | 'section' | 'other';

export enum Language {
  nl = 'nl',
  en = 'en',
  fr = 'fr',
}


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


/** Duplicated on backend */
export const TimesheetCheckAttachmentType = 'Timesheet check';
export const SignedTimesheetAttachmentType = 'Getekende timesheet';
export const InboundInvoiceAttachmentType = 'Factuur freelancer';

/**
 * InvoiceModel | ClientModel
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
  filters: {
    consultants: ConsultantListFilters,
    clients: ClientListFilters,
    invoices: InvoiceListFilters,
    projects: ProjectListFilters,
    projectMonths: ProjectMonthListFilters,
    users: UsersListFilters,
  },
}

export type NewRowFormConfig = {forceRow: boolean}

export type AnyFormConfig = string | NewRowFormConfig | FormConfig;

export type FormConfig = {
  reactKey?: string,
  label?: string,
  /**
   * Full row title
   */
  title?: string,
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
   * false to not generate a Col
   */
  cols?: number | ColSize | ColSizes | false,
  prefix?: InputIcons | React.ReactNode | string,
  suffix?: InputIcons | React.ReactNode | string,
  style?: CSSProperties,
}

/** Grid Col size */
export type ColSize = undefined | number | { span?: number, offset?: number };

/** Grid Col sizes */
export type ColSizes = {
  xs?: ColSize,
  sm?: ColSize,
  md?: ColSize,
  lg?: ColSize,
  xl?: ColSize,
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
 * Filters used on InvoiceList
 * Used for: state.app.invoiceFilters
 * TODO: This needs to go by using a ListPage for the InvoiceList
 */
export type InvoiceFilters = {
  search: InvoiceFiltersSearch[],
  groupedByMonth: boolean,
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

export interface IAudit {
  createdOn: string;
  createdBy: string;
  modifiedOn?: string;
  modifiedBy?: string;
}
