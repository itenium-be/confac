import {Moment} from 'moment';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import {ClientModel} from '../../client/models/ClientModels';
import {EditClientRateType} from '../../../models';
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
  rateType: EditClientRateType;
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
  client: ClientModel;
  partner?: ClientModel;
}

// TODO: Get rid of this: is state being manipulated? will this be sent to the backend and be saved?
// If the project.endDate changes, is this also updated?
export interface ProjectDetailsModel extends ProjectModel {
  active: boolean;
}
