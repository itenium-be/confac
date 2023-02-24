import {UserModel, RoleModel, Claim} from './UserModel';
import {IAudit} from '../../../models';

export const getNewUser = (): UserModel => ({
  _id: '',
  name: '',
  firstName: '',
  alias: '',
  email: '',
  active: true,
  roles: [],
  audit: {} as IAudit,
});


export const getNewRole = (name = '', claims: Claim[] = []): RoleModel => ({
  _id: '',
  name,
  claims,
  audit: {} as IAudit,
});


export const getAdminRole = (): RoleModel => {
  return getNewRole('admin', [
    Claim.ViewConfig, Claim.ManageConfig,
    Claim.ViewClients, Claim.ManageClients,
    Claim.ViewProjects, Claim.ManageProjects,
    Claim.ViewQuotations, Claim.ManageQuotations,
    Claim.ViewConsultants, Claim.ManageConsultants,
    Claim.ViewUsers, Claim.ManageUsers,
    Claim.ViewRoles, Claim.ManageRoles,
    Claim.ViewInvoices, Claim.EmailInvoices, Claim.ValidateInvoices, Claim.ManageInvoices,
    Claim.ViewProjectMonth, Claim.EditProjectMonth, Claim.CreateProjectMonth, Claim.ValidateProjectMonth, Claim.DeleteProjectMonth,
  ]);
};
