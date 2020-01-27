import mongoose from 'mongoose';

export interface IProject {
  _id: string;
  consultantId: string;
  startDate: string;
  endDate: string;
  partner: string;
  partnerTariff: number;
  client: string;
  clientTariff: number;
  createdOn?: string;
}

export interface IProjectMonth extends mongoose.Document {
  _id: string;
  month: string;
  projectId: string;
  createdOn?: string;
}

const projectSchema = new mongoose.Schema({
  consultantId: String,
  startDate: String,
  endDate: String,
  partner: String,
  partnerTariff: Number,
  client: String,
  clientTariff: Number,
  createdOn: String,
});

const projectMonthSchema = new mongoose.Schema<IProjectMonth>({
  month: String,
  projectId: String,
  createdOn: String,
});

export const ProjectsCollection = mongoose.model<IProject & mongoose.Document>('project', projectSchema, 'projects');
export const ProjectsPerMonthCollection = mongoose.model<IProjectMonth & mongoose.Document>('project_month', projectMonthSchema, 'projects_month');