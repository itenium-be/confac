import {UserModel} from './UserModel';
import {IAudit} from '../../../models';

export const getNewUser = (): UserModel => ({
  _id: '',
  name: '',
  firstName: '',
  alias: '',
  email: '',
  active: true,
  audit: {} as IAudit,
});
