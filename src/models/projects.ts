import mongoose from 'mongoose';

export interface IProject {
  _id: string;
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



const projectSchema = new mongoose.Schema({
  consultantId: String,
  startDate: String,
  endDate: String,
  partner: {
    clientId: String,
    tariff: Number,
    rateType: String,
    ref: String,
  },
  client: {
    clientId: String,
    tariff: Number,
    rateType: String,
    ref: String,
  },
  projectMonthConfig: {
    timesheetCheck: Boolean,
    inboundInvoice: Boolean,
  },
  createdOn: String,
});


export const ProjectsCollection = (
  mongoose.model<IProject & mongoose.Document>('project', projectSchema, 'projects')
);
