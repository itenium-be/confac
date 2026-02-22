import {Jwt} from './technical';

export interface IAttachment {
  type: string;
  fileName: string;
  originalFileName?: string;
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
  ATTACHMENTS_CONFIG = 'attachments_config',
  USERS = 'users',
  ROLES = 'roles',
}

export enum SocketEventTypes {
  EntityCreated = 'ENTITY_CREATED',
  EntityUpdated = 'ENTITY_UPDATED',
  EntityDeleted = 'ENTITY_DELETED'
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
    createdBy: user ? user.data?._id : '',
  };
}

export function updateAudit(audit: IAudit, user: Jwt): IAudit {
  if (!audit) {
    audit = createAudit();  
  }

  const doNotSetModifiedWhenCreatedAgo = 1000 * 60 * 10; // 10 minutes
  const timePassedSinceCreation = new Date().valueOf() - new Date(audit.createdOn).valueOf();
  if (audit.createdBy === user.data._id && timePassedSinceCreation < doNotSetModifiedWhenCreatedAgo) {
    return audit;
  }

  return {
    // TODO: when doing an update, it takes the audit from the body and not from the db
    //       allowing the user to overwrite the audit.createdBy by modifying the request
    ...audit,
    modifiedOn: new Date().toISOString(),
    modifiedBy: user.data._id,
  };
}
