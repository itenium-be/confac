import {Moment} from 'moment';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import {ClientModel} from '../../client/models/ClientModels';
import {EditProjectRateType} from '../../../models';
import {ProjectMonthConfig} from './ProjectMonthModel';

export interface ProjectModel {
  _id: string;
  consultantId: string;
  startDate: Moment;
  endDate?: Moment;
  partner?: ProjectClientModel;
  client: ProjectClientModel;
  projectMonthConfig: ProjectMonthConfig;
  createdOn?: string;
}

export interface ProjectClientModel {
  clientId: string;
  tariff: number;
  rateType: EditProjectRateType;
  /**
   * A per client reference, used as the invoice.orderNr
   * Unless ProjectMonthConfig.changingOrderNr: Then the
   * variable ProjectMonthModel.orderNr is used instead.
   * */
  ref?: string;
}

/**
 * Model used by the ProjectReferenceResolver
 * which turns the Ids into models
 * */
export interface FullProjectModel {
  /** The project._id */
  _id: string;
  /** The project details */
  details: ProjectDetailsModel;
  consultant: ConsultantModel;
  /** ATTN: ProjectClientModel properties to be found in details.client */
  client: ClientModel;
  /** ATTN: ProjectClientModel properties to be found in details.partner */
  partner?: ClientModel;
}

// TODO: Get rid of this: is state being manipulated? will this be sent to the backend and be saved?
// If the project.endDate changes, is this also updated?

export enum PROJECT_STATUSES {
  ACTIVE= 'ACTIVE',
  NOT_ACTIVE_ANYMORE= 'NOT_ACTIVE_ANYMORE',
  NOT_YET_ACTIVE= 'NOT_YET_ACTIVE',
}

export interface IProjectStatuses {
  ACTIVE: string;
  NOT_ACTIVE_ANYMORE: string;
  NOT_YET_ACTIVE: string;
}
export interface ProjectDetailsModel extends ProjectModel {
  status: keyof IProjectStatuses
}
