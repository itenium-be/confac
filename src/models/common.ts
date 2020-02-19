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
  ATTACHMENTS = 'attachments',
  ATTACHMENTS_CLIENT = 'attachments_client',
  PROJECTS_MONTH = 'projects_month',
  CONFIG = 'config'
}
