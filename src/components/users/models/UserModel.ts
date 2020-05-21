import {IAudit} from '../../../models';

export type UserModel = {
  _id: string;
  email: string;
  name: string;
  firstName: string;
  alias: string;
  active: boolean;
  audit: IAudit;
}


export type UserState = {
  users: UserModel[];
}
