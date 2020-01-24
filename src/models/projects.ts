import mongoose from 'mongoose';
import moment from 'moment';

export interface IProject extends mongoose.Document {
  _id: string;
  consultantId: string;
  startDate: string;
  endDate: string;
  partner: string;
  partnerTariff: number;
  client: string;
  clientTariff: number;
  createdOn: moment.Moment;
}

export interface IProjectMonth extends mongoose.Document {
  _id: string;
  month: moment.Moment;
  projectId?: string;
}

const projectSchema = new mongoose.Schema({
  consultantId: String,
  startDate: String,
  endDate: String,
  partner: String,
  partnerTariff: Number,
  client: String,
  clientTariff: Number,
  createdOn: Date,
}, {timestamps: {createdAt: 'createdOn'}});

const projectMonthSchema = new mongoose.Schema({
  _id: String,
  month: Date,
  projectId: String,
});

export const ProjectsCollection = mongoose.model<IProject>('project', projectSchema, 'projects');
export const ProjectsPerMonthCollection = mongoose.model<IProject>('project_month', projectMonthSchema, 'projects_month');