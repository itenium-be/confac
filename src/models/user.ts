import {ObjectID} from 'mongodb';
import {IAudit} from './common';

export interface IUser {
  _id: ObjectID;
  email: string;
  name: string;
  firstName: string;
  alias: string;
  active: boolean;
  audit: IAudit;
}
