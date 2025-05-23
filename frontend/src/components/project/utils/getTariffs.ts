import {EditProjectRateType} from '../../../models';
import {DefaultHoursInDay} from '../../client/models/getNewClient';
import {FullProjectModel} from '../models/FullProjectModel';
import {IProjectModel, ProjectClientModel} from '../models/IProjectModel';
import {ClientModel} from '../../client/models/ClientModels';


/** Calculated: Tariff info for a ProjectClientModel */
export type ProjectClientTariff = {
  tariff: number;
  rateType: EditProjectRateType;
}

export function getFullTariffs(project: FullProjectModel, type: 'client' | 'partner') {
  const projectClient = type === 'client' ? project.details.client : project.details.partner;
  if (!projectClient?.clientId) {
    return undefined;
  }

  const client = type === 'client' ? project.client : project.partner!;
  let hoursInDay = client.hoursInDay;
  if (type === 'client' && project.details.client.hoursInDay) {
    hoursInDay = project.details.client.hoursInDay;
  }
  const tariff = getTariffs(projectClient);
  if (tariff.rateType === 'daily') {
    return {
      dailyRate: tariff.tariff,
      hourlyRate: tariff.tariff / hoursInDay,
    };
  }
  return {
    dailyRate: tariff.tariff * hoursInDay,
    hourlyRate: tariff.tariff,
  };
}


export function getTariffs(projectClient: ProjectClientModel): ProjectClientTariff {
  return {
    tariff: projectClient.defaultInvoiceLines.reduce((prev, cur) => prev + cur.price, 0),
    rateType: projectClient.defaultInvoiceLines[0].type,
  };
}

export const compareTariffs = (t1: ProjectClientTariff, t2: ProjectClientTariff): number => {
  const t1Tariff = t1.tariff * (t1.rateType === 'hourly' ? DefaultHoursInDay : 1);
  const t2Tariff = t2.tariff * (t2.rateType === 'hourly' ? DefaultHoursInDay : 1);
  return t1Tariff - t2Tariff;
};


type TariffProjectDetails = {
  project: IProjectModel;
  client: ClientModel;
}


export function addPartnerRate(projectMonthTimesheetAmount: number, resolvedProject: TariffProjectDetails) {
  if (!resolvedProject.project.partner) {
    return 0;
  }

  const hoursInDay = resolvedProject.project.client.hoursInDay ?? resolvedProject.client.hoursInDay;
  const clientTariffs = getTariffs(resolvedProject.project.client);
  const partnerTariffs = getTariffs(resolvedProject.project.partner);
  if (clientTariffs.rateType !== partnerTariffs.rateType) {
    // The clientTariff is used to determine whether the timesheet is filled in in hours or days
    // So if the partnerTariff is different, we need a conversion
    switch (clientTariffs.rateType) {
      case 'hourly':
        projectMonthTimesheetAmount /= hoursInDay;
        break;

      case 'daily':
      default:
        projectMonthTimesheetAmount *= hoursInDay;
    }
  }
  return projectMonthTimesheetAmount * partnerTariffs.tariff;
}



/** Calculated: Margin between Client/Partner for ProjectModel */
type ProjectMarkup = {
  totalClient: number;
  amount: number;
  /** Currently the calculation for "margin" is used */
  percentage: number;
}



export function getProjectMarkup(project: TariffProjectDetails): ProjectMarkup {
  const totalClient = getTariffs(project.project.client);

  if (project.project.partner?.clientId) {
    const totalPartner = addPartnerRate(1, project);
    let margin = totalClient.tariff - totalPartner;
    if (totalClient.rateType === 'hourly') {
      margin *= project.project.client.hoursInDay ?? project.client.hoursInDay;
    }
    return {
      totalClient: totalClient.tariff,
      amount: margin,
      // Calculation "margin"
      percentage: totalClient.tariff !== 0 ? (margin / totalClient.tariff) * 100 : 0,
      // Calculation "markup"
      // percentage: (totalClient.tariff / totalPartner) * 100 - 100
    };
  }

  return {
    totalClient: totalClient.tariff,
    amount: 0,
    percentage: 0,
  };
}
