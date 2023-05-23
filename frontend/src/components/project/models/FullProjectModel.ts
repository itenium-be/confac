import moment, { Moment } from 'moment';
import { getNewConsultant } from '../../consultant/models/getNewConsultant';
import { IProjectModel, ProjectStatus } from './IProjectModel';
import { ConsultantModel } from '../../consultant/models/ConsultantModel';
import { ClientModel } from '../../client/models/ClientModels';
import { getNewClient } from '../../client/models/getNewClient';
import { ContractStatus } from '../../client/models/ContractModels';
import { ContractType } from '../../home/measurements/project/ConsultantContractsList';



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


  isActiveInMonth(month: Moment): boolean {
    const projectStartDate = moment(this.details.startDate).utc().add(this.details.startDate.utcOffset(), 'm');
    const endOfMonth = month.clone().endOf('month');
    if (projectStartDate.isAfter(endOfMonth)) {
      return false;
    }

    if (this.details.endDate) {
      const projectEndDate = moment(this.details.endDate).utc().add(this.details.endDate.utcOffset(), 'm');
      const startOfMonth = month.clone().startOf('month').startOf('day');
      if (projectEndDate.isBefore(startOfMonth)) {
        return false;
      }
    }

    return true;
  }

  isWithoutWorkContract(): boolean {
    return this.details.contract.status !== ContractStatus.BothSigned &&
      this.details.contract.status !== ContractStatus.NotNeeded
  }

  isWithoutFrameworkAgreement(): boolean {
    return this.client.frameworkAgreement.status !== ContractStatus.BothSigned &&
      this.client.frameworkAgreement.status !== ContractStatus.NotNeeded
  }

  isWithoutContract(contractType: ContractType): boolean {
    if (contractType === ContractType.All) {
      return this.isWithoutWorkContract() || this.isWithoutFrameworkAgreement();
    }
    if (contractType === ContractType.Work) {
      return this.isWithoutWorkContract();
    }
    if (contractType === ContractType.Framework) {
      return this.isWithoutFrameworkAgreement()
    }
    return false;
  }
}
