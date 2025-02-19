import {Moment} from 'moment';
import {ConsultantType} from '../../consultant/models/ConsultantModel';
import {Attachment, IAudit, IComment} from '../../../models';

/**
 * false: The invoice has not yet been verified
 * true: The invoice has been verified (=paid)
 * forced: There is no invoice, just make the system happy
 */
export type ProjectMonthStatus = boolean | 'forced';



export interface ProjectMonthModel {
  _id: string;
  month: Moment;
  projectId: string;
  timesheet: ProjectMonthTimesheet;
  inbound: ProjectMonthInbound;
  note?: string;
  comments: IComment[]
  /** The invoice orderNr when ProjectMonthConfig.changingOrderNr */
  orderNr: string;
  audit: IAudit;
  verified: ProjectMonthStatus;
  attachments: Attachment[];
}

export interface ProjectMonthOverviewModel {
  _id: string;
  month: Moment;
  fileDetails: Attachment;
}

export const ProjectMonthInboundStatusOrder = ['new', 'validated', 'paid'] as const;
export type ProjectMonthInboundStatus = typeof ProjectMonthInboundStatusOrder[number];

export interface ProjectMonthInbound {
  nr: string;
  dateReceived?: Moment | null;
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

  comments: IComment[]
}


/** Configuration for the ProjectMonth process (this is a property of ProjectModel) */
export interface ProjectMonthConfig {
  /** Is there a check mecanism to compare the timesheet with? */
  timesheetCheck: boolean;
  /** Does the consultant send an invoice? */
  inboundInvoice: boolean;
  /** Does the OrderNr change for each invoice? */
  changingOrderNr: boolean;
}

/** How monthly invoicing is handled depends on the type of consultant */
export function getDefaultProjectMonthConfig(consultantType?: ConsultantType): Omit<ProjectMonthConfig, 'changingOrderNr'> {
  switch (consultantType) {
    case 'manager':
      return {
        timesheetCheck: false,
        inboundInvoice: true,
      };

    case 'externalConsultant':
    case 'freelancer':
      return {
        timesheetCheck: false,
        inboundInvoice: true,
      };

    case 'consultant':
      return {
        timesheetCheck: true,
        inboundInvoice: false,
      };

    default:
      return {
        timesheetCheck: true,
        inboundInvoice: true,
      };
  }
}
