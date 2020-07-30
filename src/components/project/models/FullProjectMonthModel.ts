import {ProjectMonthModel} from './ProjectMonthModel';
import {IProjectModel} from './IProjectModel';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import {ClientModel} from '../../client/models/ClientModels';
import InvoiceModel from '../../invoice/models/InvoiceModel';

/** ProjectMonthModel with _ids resolved */
export class FullProjectMonthModel {
  /** The ProjectMonth._id */
  get _id(): string {
    return this.details._id;
  }

  get consultantName(): string {
    return `${this.consultant.firstName} ${this.consultant.name}`;
  }

  details: ProjectMonthModel;
  project: IProjectModel;
  consultant: ConsultantModel;
  client: ClientModel;
  partner?: ClientModel;
  invoice?: InvoiceModel;

  constructor(json: IFullProjectMonthModel) {
    this.details = json.details;
    this.project = json.project;
    this.consultant = json.consultant;
    this.client = json.client;
    this.partner = json.partner;
    this.invoice = json.invoice;
  }
};


export interface IFullProjectMonthModel {
  _id: string;
  details: ProjectMonthModel;
  project: IProjectModel;
  consultant: ConsultantModel;
  client: ClientModel;
  partner?: ClientModel;
  invoice?: InvoiceModel;
}
