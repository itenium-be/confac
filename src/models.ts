export type InvoiceDateStrategy = 'prev-month-last-day' | 'today';

export type EditClientRateType = 'hourly' | 'daily' | 'km' | 'items' | 'section' | 'other';

export type Attachment = {
  type: string,
  fileName: string,
  fileType: string,
  lastModifiedDate: string,
}
