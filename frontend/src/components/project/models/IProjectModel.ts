import {Moment} from 'moment';
import {IAudit, EditProjectRateType} from '../../../models';
import {ProjectMonthConfig} from './ProjectMonthModel';
import {InvoiceLine} from '../../invoice/models/InvoiceLineModels';
import {IContractModel} from '../../client/models/ContractModels';


export interface IProjectModel {
  _id: string;
  consultantId: string;
  startDate: Moment;
  endDate?: Moment;
  partner?: ProjectClientModel;
  client: ProjectClientModel;
  projectMonthConfig: ProjectMonthConfig;
  notes?: string;
  contract: IContractModel;
  audit: IAudit;
}


/** Client/Partner model for a Project */
export interface ProjectClientModel {
  clientId: string;
  /**
   * A per client reference, used as the invoice.orderNr
   * Unless ProjectMonthConfig.changingOrderNr: Then the
   * variable ProjectMonthModel.orderNr is used instead.
   * */
  ref?: string;
  defaultInvoiceLines: ProjectClientInvoiceLine[];
  /**
   * False (default for Client, always false for Partner): Only price & rateType
   * True: Allow full InvoiceLine[] configuration
   */
  advancedInvoicing: boolean;
}





export enum ProjectStatus {
  Active = 'Active',
  RecentlyInactive = 'RecentlyInactive',
  NotActiveAnymore = 'NotActiveAnymore',
  NotYetActive = 'NotYetActive',
}



export type ProjectClientInvoiceLine = InvoiceLine & {
  type: EditProjectRateType
}
