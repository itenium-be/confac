import mongoose from 'mongoose';

export interface IProject {
  _id: string;
  consultantId: string;
  startDate: string;
  endDate?: string;
  partner?: ProjectClientModel;
  client: ProjectClientModel;
  createdOn?: string;
}

export type EditClientRateType = 'hourly' | 'daily' | 'km' | 'items' | 'section' | 'other';

export interface ProjectClientModel {
  clientId: string;
  tariff: number;
  rateType: EditClientRateType;
  ref?: string;
}

export interface IProjectMonth {
  _id: string;
  month: string;
  projectId: string;
  createdOn?: string;
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
  createdOn: String,
});



const projectMonthSchema = new mongoose.Schema<IProjectMonth>({
  month: String,
  projectId: String,
  createdOn: String,
});

export const ProjectsCollection = mongoose.model<IProject & mongoose.Document>('project', projectSchema, 'projects');
export const ProjectsPerMonthCollection = mongoose.model<IProjectMonth & mongoose.Document>('project_month', projectMonthSchema, 'projects_month');
