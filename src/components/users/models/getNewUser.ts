import {UserModel, RoleModel} from './UserModel';
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


export const getNewRole = (): RoleModel => ({
  _id: '',
  name: '',
  claims: [],
  audit: {} as IAudit,
});
