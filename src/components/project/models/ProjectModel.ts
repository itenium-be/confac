import {Moment} from 'moment';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import {ClientModel} from '../../client/models/ClientModels';

export interface ProjectModel {
  _id: string;
  consultantId: string;
  startDate: Moment;
  endDate?: Moment;
  partner: string;
  partnerTariff: number;
  client: string;
  clientTariff: number;
}

export interface ProjectMonthModel {
  _id: string;
  month: Moment;
  projectId: string;
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
  partner: ClientModel;
}

// TODO: Get rid of this: is state being manipulated? will this be sent to the backend and be saved?
// If the project.endDate changes, is this also updated?
export interface ProjectDetailsModel extends ProjectModel {
  active: boolean;
}
