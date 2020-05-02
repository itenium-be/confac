import {UserModel} from './UserModel';

export const getNewUser = (): UserModel => ({
  _id: '',
  name: '',
  firstName: '',
  alias: '',
  email: '',
  active: true,
});
