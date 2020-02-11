import {ObjectID} from 'mongodb';

export interface IProjectMonth {
  _id: ObjectID;
  month: string;
  projectId: ObjectID;
  timesheet: ProjectMonthTimesheet;
  inbound: ProjectMonthInbound;
  createdOn?: string;
  note?: string;
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
