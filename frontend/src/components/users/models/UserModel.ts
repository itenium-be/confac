import {IAudit} from '../../../models';

export type UserModel = {
  _id: string;
  email: string;
  name: string;
  firstName: string;
  alias: string;
  active: boolean;
  /** The role.name (not role._id!) */
  roles: string[];
  audit: IAudit;
}


export type RoleModel = {
  _id: string;
  name: string;
  claims: Claim[];
  audit: IAudit;
}



export type UserState = {
  users: UserModel[];
  roles: RoleModel[];
}



export enum GenericClaim {
  View = 'view',
  Create = 'create',
  Edit = 'edit',
  Delete = 'delete',
  Email = 'mail',
  Validate = 'validate',
}


export enum Claim {
  ViewConfig = 'view-config',
  ManageConfig = 'manage-config',
  ViewClients = 'view-clients',
  ManageClients = 'manage-clients',
  ViewProjects = 'view-projects',
  ManageProjects = 'manage-projects',
  DeleteProject = 'delete-project',
  ViewQuotations = 'view-quotations',
  ManageQuotations = 'manage-quotations',
  ViewInvoices = 'view-invoices',
  ManageInvoices = 'manage-invoices',
  ValidateInvoices = 'validate-invoices',
  EmailInvoices = 'email-invoices',
  ViewProjectMonth = 'view-projectMonth',
  ValidateProjectMonth = 'validate-projectMonth',
  ValidateProjectMonthTimesheet = 'validate-projectMonthTimesheet',
  ValidateProjectMonthInbound = 'validate-projectMonthTimesheetInbound',
  CreateProjectMonth = 'create-projectMonth',
  EditProjectMonth = 'edit-projectMonth',
  DeleteProjectMonth = 'delete-projectMonth',
  ViewUsers = 'view-users',
  ManageUsers = 'manage-users',
  ViewRoles = 'view-roles',
  ManageRoles = 'manage-roles',
  ViewConsultants = 'view-consultants',
  ManageConsultants = 'manage-consultants',
  LoadHistoricalData = 'load-historical',
  ViewHome = 'view-home',
  ManageComments = 'manage-comments'
}
