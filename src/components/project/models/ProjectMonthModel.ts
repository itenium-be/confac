import {Moment} from 'moment';
import {ProjectModel} from './ProjectModel';
import {ConsultantModel, ConsultantType} from '../../consultant/models/ConsultantModel';
import {ClientModel} from '../../client/models/ClientModels';
import InvoiceModel from '../../invoice/models/InvoiceModel';
import {Attachment} from '../../../models';

export interface ProjectMonthModel {
  _id: string;
  month: Moment;
  projectId: string;
  timesheet: ProjectMonthTimesheet;
  inbound: ProjectMonthInbound;
  note?: string;
  /** The invoice orderNr when ProjectMonthConfig.changingOrderNr */
  orderNr: string;
  createdOn?: string;
  /**
   * false: The invoice has not yet been verified
   * true: The invoice has been verified (=paid)
   * forced: There is no invoice, just make the system happy
   */
  verified: boolean | 'forced';
  attachments: Attachment[];
}

export interface ProjectMonthOverviewModel {
  _id: string;
  monthId: string;
  fileDetails: Attachment;
}

export type ProjectMonthInboundStatus = 'new' | 'validated' | 'paid';

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
}

/** ProjectMonthModel with _ids resolved */
export type FullProjectMonthModel = {
  /** The ProjectMonth._id */
  _id: string;
  details: ProjectMonthModel;
  project: ProjectModel;
  consultant: ConsultantModel;
  client: ClientModel;
  partner?: ClientModel;
  invoice?: InvoiceModel;
};


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
        inboundInvoice: false,
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
