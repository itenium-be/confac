import {ObjectID} from 'mongodb';
import {IAudit} from './common';
import {InvoiceLine} from './invoices';
import {IContract} from './contracts';

export interface IProject {
  _id: ObjectID;
  consultantId: string;
  startDate: string;
  endDate?: string;
  /** UserId */
  accountManager?: string;
  contract?: IContract;
  /** We invoice the client but the project is at an endCustomer */
  forEndCustomer?: boolean;
  endCustomer?: ProjectEndCustomerModel | null;
  partner?: ProjectClientModel;
  client: ProjectClientModel;
  projectMonthConfig: {
    timesheetCheck: boolean;
    inboundInvoice: boolean;
    emailInvoiceDuplicate?: boolean;
  };
  audit: IAudit;
}

export type EditClientRateType = 'hourly' | 'daily' | 'km' | 'items' | 'section' | 'other';

export type EditProjectRateType = 'hourly' | 'daily';

export type ProjectClientInvoiceLine = InvoiceLine & {
  type: EditProjectRateType;
}


export interface ProjectClientModel {
  clientId: string;
  defaultInvoiceLines: ProjectClientInvoiceLine[];
  ref?: string;
}

export interface ProjectEndCustomerModel {
  clientId: string;
  contact: string;
  notes: string;
}
