export interface IAttachment {
  type: string;
  fileName: string;
  fileType: string;
  lastModifiedDate?: string;
}

export enum CollectionNames {
  CONSULTANTS = 'consultants',
  CLIENTS = 'clients',
  INVOICES = 'invoices',
  PROJECTS = 'projects',
  /** Invoice attachments collection */
  ATTACHMENTS = 'attachments',
  ATTACHMENTS_CLIENT = 'attachments_client',
  ATTACHMENTS_PROJECT_MONTH = 'attachments_project_month',
  ATTACHMENTS_PROJECT_MONTH_OVERVIEW = 'attachments_project_month_overview',
  PROJECTS_MONTH = 'projects_month',
  CONFIG = 'config'
}
