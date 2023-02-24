import {ObjectID} from 'mongodb';
import {IAudit} from './common';

export interface IUser {
  _id: ObjectID;
  email: string;
  name: string;
  firstName: string;
  alias: string;
  active: boolean;
  roles: string[];
  audit: IAudit;
}


export interface IRole {
  _id: ObjectID;
  name: string;
  claims: string[];
  audit: IAudit;
}
