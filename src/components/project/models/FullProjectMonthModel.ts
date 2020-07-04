import {ProjectMonthModel} from './ProjectMonthModel';
import {IProjectModel} from './IProjectModel';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import {ClientModel} from '../../client/models/ClientModels';
import InvoiceModel from '../../invoice/models/InvoiceModel';

/** ProjectMonthModel with _ids resolved */
export type FullProjectMonthModel = {
  /** The ProjectMonth._id */
  _id: string;
  details: ProjectMonthModel;
  project: IProjectModel;
  consultant: ConsultantModel;
  client: ClientModel;
  partner?: ClientModel;
  invoice?: InvoiceModel;
};
