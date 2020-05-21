import {ObjectID} from 'mongodb';
import {IAudit} from './common';

export interface IProject {
  _id: ObjectID;
  consultantId: string;
  startDate: string;
  endDate?: string;
  partner?: ProjectClientModel;
  client: ProjectClientModel;
  projectMonthConfig: {
    timesheetCheck: boolean;
    inboundInvoice: boolean;
  };
  audit: IAudit;
}

export type EditClientRateType = 'hourly' | 'daily' | 'km' | 'items' | 'section' | 'other';

export interface ProjectClientModel {
  clientId: string;
  tariff: number;
  rateType: EditClientRateType;
  ref?: string;
}
