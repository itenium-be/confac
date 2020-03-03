import {ObjectID, Binary} from 'mongodb';

import {IAttachment} from './common';

export interface IProjectMonth {
  _id: ObjectID;
  /** Format: ISO Date */
  month: string;
  projectId: ObjectID;
  timesheet: ProjectMonthTimesheet;
  inbound: ProjectMonthInbound;
  note?: string;
  /**
   * false: The invoice has not yet been verified
   * true: The invoice has been verified (=paid)
   * forced: There is no invoice, just make the system happy
   */
  verified: boolean | 'forced';
  createdOn?: string;
  attachments: IAttachment[];
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

export interface IProjectMonthOverview {
  _id: ObjectID;
  fileDetails: IAttachment;
  /** Format: ISO Date */
  month: string;
  /** One file with all the time-sheets combined  */
  allTimesheets: Buffer;
}
