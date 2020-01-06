import { ConsultantModel } from "../../consultant/models";
import { ClientModel } from "../../client/models/ClientModels";

export interface ProjectModel {
  _id?: string,
  consultantId: string,
  startDate: string,
  endDate: string,
  partner: string,
  partnerTariff: number,
  client: string,
  clientTariff: number,
}

export interface FullProjectModel {
  details: ProjectDetailsModel,
  consultant: ConsultantModel,
  client: ClientModel,
  partner: ClientModel
}

export interface ProjectDetailsModel extends ProjectModel {
  isActive: boolean
}
