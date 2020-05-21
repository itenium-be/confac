import {Jwt} from './technical';

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
  CONFIG = 'config',
  USERS = 'users',
}

export interface IAudit {
  createdOn: string;
  createdBy: string;
  modifiedOn?: string;
  modifiedBy?: string;
}

export function createAudit(user?: Jwt): IAudit {
  return {
    createdOn: new Date().toISOString(),
    createdBy: user ? user.data._id : '',
  };
}

export function updateAudit(audit: IAudit, user: Jwt): IAudit {
  return {
    ...audit,
    modifiedOn: new Date().toISOString(),
    modifiedBy: user.data._id,
  };
}
