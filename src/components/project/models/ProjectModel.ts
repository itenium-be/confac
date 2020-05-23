import {Moment} from 'moment';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import {ClientModel} from '../../client/models/ClientModels';
import {IAudit, EditProjectRateType} from '../../../models';
import {ProjectMonthConfig} from './ProjectMonthModel';
import {InvoiceLine} from '../../invoice/models/InvoiceLineModels';

export interface ProjectModel {
  _id: string;
  consultantId: string;
  startDate: Moment;
  endDate?: Moment;
  partner?: ProjectClientModel;
  client: ProjectClientModel;
  projectMonthConfig: ProjectMonthConfig;
  audit: IAudit;
}


export type ProjectClientInvoiceLine = InvoiceLine & {
  type: EditProjectRateType
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


/** Calculated: Tariff info for a ProjectClientModel */
export type ProjectClientTariff = {
  tariff: number;
  rateType: EditProjectRateType;
}


/** Calculated: Markup between Client/Partner for ProjectModel */
export type ProjectMarkup = {
  totalClient: number,
  amount: number,
  percentage: number,
}




export function getTariffs(projectClient: ProjectClientModel): ProjectClientTariff {
  return {
    tariff: projectClient.defaultInvoiceLines.reduce((prev, cur) => prev + cur.price, 0),
    rateType: projectClient.defaultInvoiceLines[0].type,
  };
}



export function getProjectMarkup(project: ProjectModel): ProjectMarkup {
  const totalClient = project.client.defaultInvoiceLines.reduce((prev, cur) => prev + cur.price, 0);

  if (project.partner) {
    const totalPartner = project.partner.defaultInvoiceLines.reduce((prev, cur) => prev + cur.price, 0);
    return {
      totalClient,
      amount: totalClient - totalPartner,
      percentage: ((totalClient / totalPartner) * 100) - 100,
    };
  }

  return {
    totalClient,
    amount: 0,
    percentage: 0,
  };
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
  notes?: string;
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
