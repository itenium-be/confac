import {ObjectID} from 'mongodb';
import {IAudit} from './common';

export interface IConsultant {
  _id: ObjectID;
  name: string;
  firstName: string;
  slug: string;
  type: string;
  email: string;
  telephone: string;
  active: boolean;
  accountingCode?: string;
  audit: IAudit;
}
