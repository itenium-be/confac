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



const projectMonthSchema = new mongoose.Schema<IProjectMonth>({
  month: String,
  projectId: String,
  createdOn: String,
});

export const ProjectsCollection = mongoose.model<IProject & mongoose.Document>('project', projectSchema, 'projects');
export const ProjectsPerMonthCollection = mongoose.model<IProjectMonth & mongoose.Document>('project_month', projectMonthSchema, 'projects_month');
