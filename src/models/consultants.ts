import {ObjectID} from 'mongodb';

export interface IConsultant {
  _id: ObjectID;
  name: string;
  firstName: string;
  slug: string;
  type: string;
  email: string;
  telephone: string;
  createdOn?: string;
  active: boolean;
}
