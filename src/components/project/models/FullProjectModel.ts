import moment, {Moment} from 'moment';
import {getNewConsultant} from '../../consultant/models/getNewConsultant';
import {IProjectModel, ProjectStatus} from './IProjectModel';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import {ClientModel} from '../../client/models/ClientModels';
import {getNewClient} from '../../client/models/getNewClient';



const ProjectStatusDaysPassedForRecentlyInactive = 60;



export class FullProjectModel {
  private _month: Moment;

  /** The project._id */
  get _id(): string {
    return this.details._id;
  }

  get consultantName(): string {
    return `${this.consultant.firstName} ${this.consultant.name}`;
  }

  /** The project details */
  details: IProjectModel;
  consultant: ConsultantModel;
  /** ATTN: ProjectClientModel properties to be found in details.client */
  client: ClientModel;
  /** ATTN: ProjectClientModel properties to be found in details.partner */
  partner?: ClientModel;


  constructor(json: IProjectModel, month?: Moment, consultant?: ConsultantModel, client?: ClientModel, partner?: ClientModel) {
    this.details = json;
    this._month = month || moment();
    this.consultant = consultant || getNewConsultant();
    this.client = client || getNewClient();
    this.partner = partner;
  }


  get status(): ProjectStatus {
    const prj = this.details;
    if (moment(prj.startDate).isAfter(this._month)) {
      return ProjectStatus.NotYetActive;
    }


    if (prj.endDate) {
      if (this._month.isBetween(prj.startDate, prj.endDate)) {
        return ProjectStatus.Active;
      }

      const daysEndedAgo = this._month.diff(prj.endDate, 'days');
      if (daysEndedAgo < ProjectStatusDaysPassedForRecentlyInactive) {
        return ProjectStatus.RecentlyInactive;
      }

      return ProjectStatus.NotActiveAnymore;
    }


    return ProjectStatus.Active;
  }


  get active(): boolean {
    return this.status === ProjectStatus.Active;
  }
}
