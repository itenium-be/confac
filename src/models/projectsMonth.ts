import mongoose from 'mongoose';

export interface IProjectMonth {
  _id: string;
  month: string;
  projectId: string;
  timesheet: ProjectMonthTimesheet;
  inbound: ProjectMonthInbound;
  createdOn?: string;
}


export type ProjectMonthInboundStatus = 'new' | 'validated' | 'paid';

export interface ProjectMonthInbound {
  nr: string;
  dateReceived?: string;
  status: ProjectMonthInboundStatus;
}



export interface ProjectMonthTimesheet {
  /** Amount of days/hours as on the timesheet attachment */
  timesheet?: number;
  /** Amount of days/hours as on report from social secretary timesheet */
  check?: number;
  /** True when timesheet and check props are validated */
  validated: boolean;
  /** Some contextual info */
  note?: string;
}




const projectMonthSchema = new mongoose.Schema<IProjectMonth>({
  month: String,
  projectId: String,
  timesheet: {
    timesheet: Number,
    check: Number,
    validated: Boolean,
    note: String,
  },
  inbound: {
    nr: String,
    dateReceived: String,
    status: String,
  },
  createdOn: String,
});


export const ProjectsPerMonthCollection = (
  mongoose.model<IProjectMonth & mongoose.Document>('project_month', projectMonthSchema, 'projects_month')
);
