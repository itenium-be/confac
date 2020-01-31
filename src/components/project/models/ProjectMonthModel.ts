import {Moment} from 'moment';
import {ProjectModel} from './ProjectModel';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import {ClientModel} from '../../client/models/ClientModels';

export interface ProjectMonthModel {
  _id: string;
  month: Moment;
  projectId: string;
  timesheet: ProjectMonthTimesheet;
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
  details: ProjectMonthModel;
  project: ProjectModel;
  consultant: ConsultantModel;
  client: ClientModel;
  partner?: ClientModel;
};
