import {ObjectID} from 'mongodb';

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
  createdOn?: string;
}

export type EditClientRateType = 'hourly' | 'daily' | 'km' | 'items' | 'section' | 'other';

export interface ProjectClientModel {
  clientId: string;
  tariff: number;
  rateType: EditClientRateType;
  ref?: string;
}
